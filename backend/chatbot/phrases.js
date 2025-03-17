const phrases = {
    greetings: {
        keywords: ["hello", "hi", "hey", "greetings", "morning", "afternoon"],
        responses: ["Hello! How can I help?", "Hi there! What can I do for you?", "Hey! What's up?"]
    },
    farewells: {
        keywords: ["bye", "goodbye", "see you", "later", "take care"],
        responses: ["Goodbye! Have a great day!", "See you later! Take care!", "Bye! Come back soon!"]
    },
    bot_identity: {
        keywords: ["your name", "who are you", "what's your name"],
        responses: ["I'm an AI chatbot here to assist you!", "I'm just a bot, but you can call me ChatBot."]
    },
    capabilities: {
        keywords: ["what can you do", "your abilities", "how can you help"],
        responses: [
            "I can chat with you, answer basic questions, and remember past conversations!",
            "I can assist with general knowledge, chat history, and more!"
        ]
    },
    weather: {
        keywords: ["weather", "how's the weather", "is it hot", "is it cold"],
        responses: [
            "I can't check the weather, but you can try looking it up online!",
            "I don't have real-time data, but you can use a weather app!"
        ]
    },
    time: {
        keywords: ["time", "what time is it", "current time"],
        responses: [
            "I can't check the exact time, but you can look at your clock!",
            "Time flies! You might want to check your watch!"
        ]
    },
    default: {
        responses: ["I'm not sure I understand. Could you rephrase?", "I don't know the answer to that yet."]
    }
};

module.exports = phrases;