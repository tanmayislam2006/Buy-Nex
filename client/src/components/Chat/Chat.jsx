import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Change to your backend URL

const Chat = ({ productId, sellerId, customerId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    // Register current user (customer) with the backend socket server
    socket.emit("register", customerId);
    // Listen for messages from seller
    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });
    // Cleanup on unmount
    return () => {
      socket.off("receive_message");
    };
  }, [customerId]);

  // Send message handler
  const sendMessage = () => {
    if (input.trim() === "") return;

    const message = {
      productId,
      sellerId,
      customerId,
      text: input.trim(),
      sender: "customer",
      timestamp: new Date().toISOString(),
    };

    // Send message to backend
    socket.emit("send_message", message);

    // Show the message instantly in UI
    setMessages((prev) => [...prev, message]);

    // Clear input field
    setInput("");
  };

  return (
    <div className="chat-container" style={{border: "1px solid #ccc", padding: 10, width: 350}}>
      <h3>Chat with Seller</h3>
      <div
        className="messages"
        style={{ height: 200, overflowY: "scroll", border: "1px solid #ddd", padding: 5, marginBottom: 10 }}
      >
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: 6 }}>
            <strong>{msg.sender === "customer" ? "You" : "Seller"}:</strong> {msg.text}
            <br />
            <small style={{ color: "#888" }}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </small>
          </div>
        ))}
      </div>

      <input
        type="text"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
        style={{ width: "100%", padding: 8 }}
      />
      <button onClick={sendMessage} style={{ marginTop: 6, width: "100%" }}>
        Send
      </button>
    </div>
  );
};

export default Chat;
