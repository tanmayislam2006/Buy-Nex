import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Change for production

const Chat = ({ productId, sellerId, customerId, productName }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.emit("register", customerId);

    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [customerId]);

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

    socket.emit("send_message", message);
    setMessages((prev) => [...prev, message]);
    setInput("");
  };

  return (
    <div className="flex flex-col border border-gray-300 rounded-md p-4 w-full max-w-md h-[400px]">
      <h3 className="text-lg font-semibold mb-3">
        Chat with Seller {productName ? `of ${productName}` : ""}
      </h3>

      <div className="flex-grow overflow-y-auto border border-gray-200 rounded-md p-3 mb-4">
        {messages.length === 0 ? (
          <p className="text-gray-500 text-center">No messages yet</p>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-3 flex flex-col ${
                msg.sender === "customer" ? "items-end" : "items-start"
              }`}
            >
              <span
                className={`inline-block px-3 py-2 rounded-lg max-w-xs break-words ${
                  msg.sender === "customer"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.text}
              </span>
              <small className="text-gray-400 mt-1 text-xs">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </small>
            </div>
          ))
        )}
      </div>

      <input
        type="text"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") sendMessage();
        }}
        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      <button
        onClick={sendMessage}
        className="mt-2 bg-green-600 text-white rounded-md px-4 py-2 hover:bg-green-700 disabled:bg-green-300"
        disabled={input.trim() === ""}
      >
        Send
      </button>
    </div>
  );
};

export default Chat;
