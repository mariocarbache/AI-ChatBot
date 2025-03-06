async function sendMessage() {
    const message = document.getElementById("message").value;
    if (!message) return alert("Please type something!"); // Alert for empty messages
  
    const response = await fetch("http://localhost:3000/chat", { // API request
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });
  
    const data = await response.json();
    const chat = document.getElementById("chat");
    chat.innerHTML += `<p>You: ${message}</p>`; // User message display
    chat.innerHTML += `<p>Bot: ${data.reply}</p>`; // Bot reply display
    document.getElementById("message").value = ""; // Clear input field
    chat.scrollTop = chat.scrollHeight; // Automatically scrolls to the latest message
  }

  function clearChat() {
    const chat = document.getElementById("chat");
    chat.innerHTML = ""; // Clears all messages
  }