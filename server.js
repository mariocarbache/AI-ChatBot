const express = require('express');
const bodyParser = require('body-parser');
const Trie = require('./chatbot/trie');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(require('cors')());

const trie = new Trie();
const phrases = ['hello', 'bye', 'thanks', 'help', 'how are you'];
phrases.forEach((phrase) => trie.insert(phrase));

app.post('/chat', (req, res) => {
    const { message } = req.body;
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