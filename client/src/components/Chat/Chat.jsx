import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Link } from "react-router";

const socket = io("http://localhost:5000"); // Change this for production

const Chat = ({ productId, sellerEmail, customerEmail, productName }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  // Register socket connection for customer
  useEffect(() => {
    if (!customerEmail) return;
    socket.emit("register", customerEmail);

    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [customerEmail]);
  const sendMessage = () => {
    if (!input.trim() || !sellerEmail || !customerEmail) return;

    const message = {
      productId,
      productName,
      sellerEmail,
      customerEmail,
      text: input.trim(),
      sender: "customer",
      timestamp: new Date().toISOString(),
    };

    socket.emit("send_message", message);
    setMessages((prev) => [...prev, message]);
    setInput("");
  };

  // If required info is missing
  if (!sellerEmail || !customerEmail) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center bg-red-50 border border-red-200 p-6 rounded-md shadow">
        <h2 className="text-lg font-semibold text-red-600 mb-2">
          Chat not available
        </h2>
        <p className="text-gray-600 mb-4">
          We couldn't identify the seller or customer. Please return to the
          product page.
        </p>
        <Link
          to="/all-products"
          className="inline-block bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col border border-gray-300 rounded-lg p-5 w-full max-w-sm mx-auto h-[500px] shadow bg-white">
      {/* Header with product info */}
      <div className="mb-4 border-b pb-3">
        <h2 className="text-lg font-semibold text-gray-800">
          Chat about: <span className="text-green-600">{productName}</span>
        </h2>
        <p className="text-sm text-gray-500">
          Product ID:{" "}
          <span className="font-mono text-gray-700">{productId}</span>
        </p>
      </div>

      {/* Messages box */}
      <div className="flex-grow overflow-y-auto border rounded-md p-4 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet</p>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-3 flex flex-col ${
                msg.sender === "customer" ? "items-end" : "items-start"
              }`}
            >
              <span
                className={`px-4 py-2 rounded-lg max-w-xs break-words shadow ${
                  msg.sender === "customer"
                    ? "bg-green-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.text}
              </span>
              <small className="text-xs text-gray-400 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </small>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input and send */}
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="btn btn-primary"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
