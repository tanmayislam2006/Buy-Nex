import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { Link } from "react-router";
import useAxios from "./../../Hooks/useAxios";

const socket = io("http://localhost:5000"); // Change this for production

const Chat = ({ productId, sellerEmail, customerEmail, productName }) => {
  const axiosInstance = useAxios();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  // Fetch message history
  useEffect(() => {
    if (sellerEmail && customerEmail) {
      axiosInstance
        .get(`/messages/${sellerEmail}/${customerEmail}`)
        .then((res) => {
          setMessages(res.data);
        });
    }
  }, [sellerEmail, customerEmail, axiosInstance]);

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
    <div className="flex flex-col border border-gray-200 rounded-xl p-6 w-full max-w-md mx-auto h-[520px] shadow-lg bg-white relative">
      {/* Chat tail */}
      <div className="absolute -bottom-3 right-4 w-6 h-6 bg-white rotate-45 z-10 border-b border-r border-gray-200"></div>
      {/* Header */}
      <div className="mb-5 border-b border-gray-300 pb-4 flex items-center gap-3">
        <div className="bg-orange-100 rounded-full w-10 h-10 flex items-center justify-center">
          <svg
            width="24"
            height="24"
            fill="none"
            stroke="#F85606"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12h8M12 8v8" />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-800">
            Chat about: <span className="text-primary">{productName}</span>
          </h2>
          <p className="text-xs text-gray-500">
            Product ID:{" "}
            <span className="font-mono text-gray-700">{productId}</span>
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <svg
              width="40"
              height="40"
              fill="none"
              stroke="gray"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <p className="mt-2">No messages yet</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-4 flex flex-col ${
                msg.sender === "customer" ? "items-end" : "items-start"
              }`}
            >
              <span
                className={`px-4 py-2 rounded-md max-w-xs break-words shadow-md ${
                  msg.sender === "customer"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.text}
              </span>
              <small className="text-xs text-gray-400 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </small>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="mt-5 flex gap-2">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="w-full px-4 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:border-primary"
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className="btn btn-primary text-white font-semibold disabled:bg-gray-400 disabled:text-gray-300 cursor-pointer"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
