const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const Chat = require("./models/chat");
const dataset = require('./ml/dataset.json');
const predictIntent = require('./ml/predict.js');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(require('cors')());

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ reply: "No message provided." });

  let intent;
  try {
    intent = await predictIntent(message);
  } catch (err) {
    console.error("Intent prediction failed:", err);
    return res.status(500).json({ reply: "Internal error predicting intent." });
  }

  const intentData = dataset.intents.find((item) => item.tag === intent);
  let reply;
  if (intentData && intentData.responses.length > 0) {
    reply = intentData.responses[Math.floor(Math.random() * intentData.responses.length)];
  } else {
    reply = "Sorry, I don't understand that.";
  }

  try {
    await Chat.create({ userMessage: message, botReply: reply });
  } catch (err) {
    console.error("Error saving chat:", err);
  }

  res.json({ reply });
});

app.get('/history', async (req, res) => {
  try {
    const chats = await Chat.find().sort({ createdAt: -1 }).limit(10);
    res.json(chats);
  } catch (err) {
    console.error("Error retrieving chat history:", err);
    res.status(500).json({ error: "Failed to retrieve chat history." });
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to the AI Chatbot!');
});

app.delete('/clear-history', async (req, res) => {
  try {
    await Chat.deleteMany({});
    res.json({ message: "Chat history cleared successfully!" });
  } catch (err) {
    console.error("Error clearing chat history:", err);
    res.status(500).json({ error: "Failed to clear chat history." });
  }
});

mongoose.connect("mongodb://localhost:27017/ai-chatbot")
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));