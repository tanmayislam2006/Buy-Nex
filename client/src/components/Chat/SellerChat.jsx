import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Update for production

const SellerChat = ({ sellerEmail }) => {
  const [conversations, setConversations] = useState({});
  const [activeCustomer, setActiveCustomer] = useState(null);
  const [input, setInput] = useState("");

  useEffect(() => {
    socket.emit("register", sellerEmail);

    socket.on("receive_message", (message) => {
      const { customerEmail } = message;

      setConversations((prev) => ({
        ...prev,
        [customerEmail]: [...(prev[customerEmail] || []), message],
      }));

      if (!activeCustomer) {
        setActiveCustomer(customerEmail);
      }
    });

    return () => {
      socket.off("receive_message");
    };
  }, [sellerEmail, activeCustomer]);

  const sendMessage = () => {
    if (!input.trim() || !activeCustomer) return;

    const firstMsg = conversations[activeCustomer]?.[0];

    const message = {
      productId: firstMsg?.productId || null,
      productName: firstMsg?.productName || "",
      sellerEmail,
      customerEmail: activeCustomer,
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
    <div className="flex h-[600px] w-full max-w-6xl border rounded-md shadow-lg mx-auto bg-white overflow-hidden">
      {/* 👥 Customer List */}
      <div className="w-1/3 border-r overflow-y-auto p-4 bg-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Customers</h2>

        {Object.keys(conversations).length === 0 && (
          <p className="text-sm text-gray-500">No customers yet</p>
        )}

        {Object.keys(conversations).map((customerEmail) => (
          <button
            key={customerEmail}
            onClick={() => setActiveCustomer(customerEmail)}
            className={`block w-full text-left px-4 py-3 mb-2 rounded-lg transition duration-300 text-sm font-medium break-words ${
              activeCustomer === customerEmail
                ? "bg-blue-600 text-white shadow"
                : "bg-white hover:bg-blue-50 text-gray-700 border"
            }`}
          >
            {customerEmail}
          </button>
        ))}
      </div>

      {/* 💬 Chat Panel */}
      <div className="w-2/3 flex flex-col p-5 relative">
        {activeCustomer ? (
          <>
            {/* Header: Product Info */}
            <div className="mb-4 border-b pb-3">
              <p className="text-sm text-gray-500">
                Chatting with:{" "}
                <span className="font-medium text-blue-600">
                  {activeCustomer}
                </span>
              </p>
              <h2 className="text-lg font-semibold text-gray-800 mt-1">
                🛍️ {conversations[activeCustomer]?.[0]?.productName || "Product"}
              </h2>
              <p className="text-xs text-gray-400">
                Product ID:{" "}
                <span className="text-gray-600 font-mono">
                  {conversations[activeCustomer]?.[0]?.productId || "N/A"}
                </span>
              </p>
            </div>

            {/* Messages */}
            <div className="flex-grow overflow-y-auto border rounded-md p-4 bg-gray-50">
              {(conversations[activeCustomer] || []).map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-4 flex flex-col ${
                    msg.sender === "seller" ? "items-end" : "items-start"
                  }`}
                >
                  <span
                    className={`px-4 py-2 rounded-xl max-w-sm break-words shadow ${
                      msg.sender === "seller"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-900"
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

            {/* Input Box */}
            <div className="flex gap-2 mt-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type your message..."
                className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim()}
                className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a customer to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerChat;
