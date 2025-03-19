const express = require('express');
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const Trie = require('./chatbot/trie');
const phrases = require('./chatbot/phrases');
const Chat = require("./models/chat");


function generateReply(message, trie) {
  const lowerMessage = message.toLowerCase();

  for (let category in phrases) {
    if (category !== "default") {
      for (let keyword of phrases[category].keywords) {
        if (trie.search(keyword) && lowerMessage.includes(keyword)) {
          const responses = phrases[category].responses;
          return responses[Math.floor(Math.random() * responses.length)]; // Random response
        }
      }
    }
  }

  // If no match is found, return a default response
  const defaultResponses = phrases.default.responses;
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(require('cors')());

const trie = new Trie();
Object.values(phrases).forEach(category => {
  if (category.keywords) { 
      category.keywords.forEach(keyword => trie.insert(keyword));
  }
});

app.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ reply: "No message provided." });

  const reply = generateReply(message, trie);

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