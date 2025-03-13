const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const Trie = require('./chatbot/trie');
const phrases = require('./chatbot/phrases');
const Chat = require("./models/chat");

function generateReply(message) {
  const lowerMessage = message.toLowerCase();

  // Greetings
  if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
    return Math.random() > 0.5 ? "Hello! How can I help?" : "Hi there! What can I do for you?";
  }

  // Farewells
  if (lowerMessage.includes("bye")) {
    return Math.random() > 0.5 ? "Goodbye! Have a great day!" : "See you later! Take care!";
  }

  // Asking how the bot is
  if (lowerMessage.includes("how are you")) {
    return "I'm just a bot, but I'm here to help!";
  }

  // Unknown input
  return "I'm not sure I understand. Could you rephrase?";
}

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(require('cors')());

const trie = new Trie();
phrases.forEach((phrase) => trie.insert(phrase));

app.post('/chat', async(req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ reply: "No message provided." });

  const reply = generateReply(message);

  // Save to MongoDB
  try {
    await Chat.create({ userMessage: message, botReply: reply });
} catch (err) {
    console.error("Error saving chat:", err);
}

  res.json({ reply });
});

app.get('/history', async (req, res) => {
  try {
      const chats = await Chat.find().sort({ createdAt: -1 }).limit(10); // Get last 10 messages
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

mongoose.connect("mongodb://localhost:27017/ai-chatbot").then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));