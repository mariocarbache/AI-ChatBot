const tf = require("@tensorflow/tfjs-node");
const fs = require("fs");

// Load the dataset
const rawData = fs.readFileSync("./backend/ml/preprocessed.json");
const { documents, words, classes } = JSON.parse(rawData);

// Create Bag of Words
function bagOfWords(tokenized, vocab) {
  const bag = Array(vocab.length).fill(0);
  tokenized.forEach(word => {
    const index = vocab.indexOf(word);
    if (index !== -1) bag[index] = 1;
  });
  return bag;
}

// Prepare training data
const xs = [];
const ys = [];

documents.forEach(doc => {
  const bow = bagOfWords(doc.words, words);
  xs.push(bow);
  ys.push(classes.indexOf(doc.tag));
});

const xsTensor = tf.tensor2d(xs);
const ysTensor = tf.oneHot(ys, classes.length);

// Build the model
const model = tf.sequential();
model.add(tf.layers.dense({ units: 8, inputShape: [words.length], activation: "relu" }));
model.add(tf.layers.dense({ units: 8, activation: "relu" }));
model.add(tf.layers.dense({ units: classes.length, activation: "softmax" }));

model.compile({
  loss: "categoricalCrossentropy",
  optimizer: tf.train.adam(),
  metrics: ["accuracy"]
});

// Train the model
(async () => {
  console.log("Training...");
  await model.fit(xsTensor, ysTensor, {
    epochs: 200,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        if (epoch % 20 === 0) console.log(`Epoch ${epoch}: loss = ${logs.loss.toFixed(4)}`);
      }
    }
  });

  console.log("Training complete!");

  // Save the model and metadata
  await model.save("file://./backend/ml/model");
  fs.writeFileSync("./backend/ml/metadata.json", JSON.stringify({ words, classes }, null, 2));
  console.log("Model and metadata saved.");
})();