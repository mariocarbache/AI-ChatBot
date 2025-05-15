const tf = require("@tensorflow/tfjs-node");
const fs = require("fs");

let model;
let metadata = {};

async function loadModelAndMetadata() {
  model = await tf.loadLayersModel("file://./ml/model/model.json");
  metadata = JSON.parse(fs.readFileSync("./ml/metadata.json"));
  console.log("Model and metadata loaded.");
}

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z\s]/g, "")
    .split(" ")
    .filter(Boolean);
}

function textToTensor(text) {
  const sentenceWords = tokenize(text);
  const bag = metadata.words.map(word => (sentenceWords.includes(word) ? 1 : 0));
  return tf.tensor2d([bag]);
}

async function predictIntent(text) {
  if (!model) await loadModelAndMetadata();

  const inputTensor = textToTensor(text);
  const prediction = model.predict(inputTensor);
  const predictions = await prediction.data();

  const maxIndex = predictions.indexOf(Math.max(...predictions));
  return metadata.classes[maxIndex];
}

module.exports = predictIntent;