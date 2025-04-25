const fs = require('fs');
const natural = require('natural');

//Load daataset
const rawData = fs.readFileSync('./backend/chatbot/dataset.json');
const dataset = JSON.parse(rawData);

//Tokenizer setup
const tokenizer = new natural.WordTokenizer();
const words = new Set();
const classes = [];
const documents = [];

dataset.intents.forEach(intent => {
    classes.push(intent.tag);
    intent.patterns.forEach(pattern => {
        const tokenizedWords = tokenizer.tokenize(pattern.toLowerCase());
        words.add(...tokenizedWords);
        documents.push({ words: tokenizedWords, tag: intent.tag });
    });
});

// Convert words to array & sort
const wordsArray = Array.from(words).sort();
const classesArray = Array.from(classes).sort();

// Save preprocessed data
const preprocessedData = {
    words: wordsArray,
    classes: classesArray,
    documents: documents
};

fs.writeFileSync('./backend/ml/preprocessed.json', JSON.stringify(preprocessedData, null, 2));

console.log("Preprocessing complete. Data saved to preprocessed.json");

