const express = require('express');
const bodyParser = require('body-parser');
const Trie = require('./chatbot/trie');
const phrases = require('./chatbot/phrases');

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
    if (trie.search(message.toLowerCase())) {
      res.json({ reply: `You said: "${message}". How can I help?` });
    } else {
      res.json({ reply: "I don't understand that." });
    }
  });
  
  app.get('/', (req, res) => {
    res.send('Welcome to the AI Chatbot!');
  });

  app.listen(port, () => console.log(`Server running at http://localhost:${port}`));