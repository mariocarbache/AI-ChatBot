const express = require('express');
const bodyParser = require('body-parser');
const Trie = require('./chatbot/trie');
const phrases = require('./chatbot/phrases');

function generateReply(message) {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi")) {
      return "Hello! How can I help you today?";
    }
    if (lowerMessage.includes("bye")) {
      return "Goodbye! Have a great day!";
    }
    return "I don't understand that.";
  }

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(require('cors')());

const trie = new Trie();
phrases.forEach((phrase) => trie.insert(phrase));

app.post('/chat', (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ reply: "No message provided." });
    }
    const reply = generateReply(message);
    res.json({ reply });
  });
  
  app.get('/', (req, res) => {
    res.send('Welcome to the AI Chatbot!');
  });

  app.listen(port, () => console.log(`Server running at http://localhost:${port}`));