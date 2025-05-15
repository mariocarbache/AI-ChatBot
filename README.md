# AI Chatbot

This is a simple AI-powered chatbot built using Node.js, Express, and TensorFlow.js. It classifies user messages into predefined intent categories and responds accordingly. It also stores conversation history using MongoDB.

## Features

- Intent classification using a trained TensorFlow.js model.
- Persistent chat history using MongoDB and Mongoose.
- RESTful API endpoints for interacting with the chatbot.
- Simple and functional frontend chat UI.

## Tech Stack

- **Backend:** Node.js, Express, TensorFlow.js, Mongoose
- **Database:** MongoDB
- **Frontend:** HTML, CSS, JavaScript (to be enhanced)
- **Model Training:** Preprocessing, Bag of Words, Multi-class classification


## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/mariocarbache/ai-chatbot.git
cd ai-chatbot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Train the Model

```bash
node backend/ml/preprocess.js
node backend/ml/train-intent-model.js
```

### 4. Start MongoDB (if not already running)

```bash
mongod
```

### 5. Start the Server

```bash
node backend/server.js
```

The server will run on `http://localhost:3000`.

### 6. Open Frontend

Open the `frontend/index.html` in your browser.

## API Endpoints

- `POST /chat` — Send a message and get a response.
- `GET /history` — Retrieve the last 10 chat entries.
- `DELETE /clear-history` — Clear all stored chat history.

## Next Steps

- Enhance bot responses to support contextual conversations.
- Improve frontend UI/UX for a more polished experience.
- Add user session tracking and intent confidence score display.
- Explore integration with external APIs (e.g., weather, news).