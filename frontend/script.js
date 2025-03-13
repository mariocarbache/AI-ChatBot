document.getElementById("message").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent form submission
        sendMessage();
    }
});

async function loadChatHistory() {
    const chat = document.getElementById("chat");

    try {
        const response = await fetch("http://localhost:3000/history");
        const data = await response.json();

        data.reverse().forEach(entry => {  // Reverse to display oldest first
            chat.innerHTML += `<p class="user-message">You: ${entry.userMessage}</p>`;
            chat.innerHTML += `<p class="bot-message">Bot: ${entry.botReply}</p>`;
        });

        chat.scrollTop = chat.scrollHeight; // Scroll to bottom
    } catch (err) {
        console.error("Failed to load chat history:", err);
    }
}

// Call the function when the page loads
window.onload = loadChatHistory;

async function sendMessage() {
    const inputField = document.getElementById('message');
    const message = document.getElementById("message").value;
    const chat = document.getElementById("chat");

    if (!message) return alert("Please type something!");

    chat.innerHTML += `<p class="user-message">You: ${message}</p>`; // Display user message
    inputField.value = ""; //Clear input
    inputField.focus(); //Auto-focus
    chat.scrollTop = chat.scrollHeight; //Auto-scroll

    const typingIndicator = document.createElement("p"); // Create new element
    typingIndicator.textContent = "Bot is typing...";
    typingIndicator.id = "typing-indicator";
    typingIndicator.classList.add("bot-message"); // Apply bot styling
    chat.appendChild(typingIndicator); // Add it at the bottom
    chat.scrollTop = chat.scrollHeight; // Auto-scroll

    // Simulate bot typing delay
    await new Promise(resolve => setTimeout(resolve, 1100));

    const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
    });

    const data = await response.json();

    typingIndicator.remove(); // Remove the typing message
    chat.innerHTML += `<p class="bot-message">Bot: ${data.reply}</p>`; // Display bot reply
    chat.scrollTop = chat.scrollHeight; //Auto-scroll
}

async function clearChat() {
    if (!confirm("Are you sure you want to clear the chat history?")) return;

    try {
        await fetch("http://localhost:3000/clear-history", { method: "DELETE" });
        document.getElementById("chat").innerHTML = ""; // Clear frontend chat window
    } catch (error) {
        console.error("Error clearing chat history:", error);
    }
}