import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Update if deployed

const SellerChat = ({ sellerId }) => {
  const [conversations, setConversations] = useState({}); // { customerId: [messages] }
  const [activeCustomer, setActiveCustomer] = useState(null);
  const [input, setInput] = useState("");

  // Connect socket and handle message receiving
  useEffect(() => {
    socket.emit("register", sellerId);

    socket.on("receive_message", (message) => {
      const { customerId } = message;

      setConversations((prev) => ({
        ...prev,
        [customerId]: [...(prev[customerId] || []), message],
      }));

      // Auto-focus on first user if none selected
      if (!activeCustomer) {
        setActiveCustomer(customerId);
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [sellerId, activeCustomer]);

  // Send message to selected customer
  const sendMessage = () => {
    if (!input.trim() || !activeCustomer) return;

    const message = {
      productId: conversations[activeCustomer]?.[0]?.productId || null,
      sellerId,
      customerId: activeCustomer,
      text: input.trim(),
      sender: "seller",
      timestamp: new Date().toISOString(),
    };

    socket.emit("send_message", message);

    setConversations((prev) => ({
      ...prev,
      [activeCustomer]: [...(prev[activeCustomer] || []), message],
    }));

    setInput("");
  };

  return (
    <div className="flex h-[500px] w-full max-w-4xl border rounded-md shadow mx-auto">
      {/* Customer List */}
      <div className="w-1/3 border-r overflow-y-auto p-3 bg-gray-50">
        <h2 className="text-lg font-semibold mb-3">Customers</h2>
        {Object.keys(conversations).length === 0 && (
          <p className="text-sm text-gray-500">No customers yet</p>
        )}
        {Object.keys(conversations).map((customerId) => (
          <button
            key={customerId}
            onClick={() => setActiveCustomer(customerId)}
            className={`block w-full text-left px-3 py-2 mb-2 rounded-md transition ${
              activeCustomer === customerId
                ? "bg-blue-600 text-white"
                : "bg-white hover:bg-gray-100 text-gray-800 border"
            }`}
          >
            {customerId}
          </button>
        ))}
      </div>

      {/* Chat Area */}
      <div className="w-2/3 flex flex-col p-4">
        <h2 className="text-lg font-semibold mb-3">
          Chat with {activeCustomer || "..." }
        </h2>

        {/* Message Display */}
        <div className="flex-grow overflow-y-auto border rounded-md p-3 mb-4 bg-white">
          {(conversations[activeCustomer] || []).map((msg, idx) => (
            <div
              key={idx}
              className={`mb-3 flex flex-col ${
                msg.sender === "seller" ? "items-end" : "items-start"
              }`}
            >
              <span
                className={`px-3 py-2 rounded-lg max-w-xs break-words ${
                  msg.sender === "seller"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.text}
              </span>
              <small className="text-gray-400 mt-1 text-xs">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </small>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={
              activeCustomer ? "Type your message..." : "Select a customer"
            }
            className="flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            disabled={!activeCustomer}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || !activeCustomer}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerChat;
