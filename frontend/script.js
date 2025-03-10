async function sendMessage() {
    const message = document.getElementById("message").value;
    const chat = document.getElementById("chat");

    if (!message) return alert("Please type something!");

    chat.innerHTML += `<p>You: ${message}</p>`; // Display user message
    document.getElementById("message").value = ""; // Clear input field

    const typingIndicator = document.createElement("p"); // Create new element
    typingIndicator.textContent = "Bot is typing...";
    typingIndicator.id = "typing-indicator";
    chat.appendChild(typingIndicator); // Add it at the bottom
    chat.scrollTop = chat.scrollHeight; // Auto-scroll

    // Simulate bot typing delay
    await new Promise(resolve => setTimeout(resolve, 1200));

    const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
    });

    const data = await response.json();

    typingIndicator.remove(); // Remove the typing message
    chat.innerHTML += `<p>Bot: ${data.reply}</p>`; // Display bot reply
    chat.scrollTop = chat.scrollHeight; 
  }

  function clearChat() {
    const chat = document.getElementById("chat");
    chat.innerHTML = "";
  }