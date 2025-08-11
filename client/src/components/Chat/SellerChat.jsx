import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import useAxios from "../../Hooks/useAxios";

const socket = io("https://buy-nex-chat-server.onrender.com"); // Update for production
const SellerChat = ({ sellerEmail }) => {
  const [conversations, setConversations] = useState({});
  const [inputs, setInputs] = useState({});
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const axiosInstance = useAxios();

  useEffect(() => {
    socket.emit("register", sellerEmail);
    socket.on("receive_message", (message) => {
      const { customerEmail } = message;
      if (!customerEmail) return;

      setConversations((prev) => ({
        ...prev,
        [customerEmail]: [...(prev[customerEmail] || []), message],
      }));
    });

    return () => {
      socket.off("receive_message");
    };
  }, [sellerEmail]);

  // Load messages when a new customer appears in the conversation
  useEffect(() => {
    const customerEmails = Object.keys(conversations);
    customerEmails.forEach((email) => {
      axiosInstance.get(`/messages/${sellerEmail}/${email}`).then((res) => {
        setConversations((prev) => ({
          ...prev,
          [email]: res.data,
        }));
      });
    });
  }, [axiosInstance, conversations, sellerEmail]);

  const sendMessage = (customerEmail) => {
    const input = inputs[customerEmail]?.trim();
    if (!input) return;

    const firstMsg = conversations[customerEmail]?.[0];

    const message = {
      productId: firstMsg?.productId || null,
      productName: firstMsg?.productName || "",
      sellerEmail,
      customerEmail,
      text: input,
      sender: "seller",
      timestamp: new Date().toISOString(),
    };

    socket.emit("send_message", message);

    setConversations((prev) => ({
      ...prev,
      [customerEmail]: [...(prev[customerEmail] || []), message],
    }));

    setInputs((prev) => ({ ...prev, [customerEmail]: "" }));
  };

  return (
    <div className="flex w-full max-w-6xl mx-auto p-4 gap-6">
      {/* Customer List */}
      <div className="w-1/4 border-r pr-4">
        <h3 className="font-bold mb-2">Customers</h3>
        <ul>
          {Object.keys(conversations).length === 0 ? (
            <li className="text-gray-500">No conversations yet</li>
          ) : (
            Object.keys(conversations).map((customerEmail) => (
              <li
                key={customerEmail}
                className={`cursor-pointer p-2 rounded ${
                  selectedCustomer === customerEmail ? "bg-blue-100" : ""
                }`}
                onClick={() => setSelectedCustomer(customerEmail)}
              >
                {customerEmail}
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Chat Window */}
      <div className="flex-1">
        {selectedCustomer ? (
          <div className="border rounded-md shadow-md bg-white p-4">
            <div className="mb-2 border-b pb-2">
              <p className="text-sm text-gray-500">
                Chatting with:{" "}
                <span className="text-blue-600 font-medium">{selectedCustomer}</span>
              </p>
              <h2 className="text-lg font-semibold">
                🛍️ {conversations[selectedCustomer]?.[0]?.productName || "Product"}
              </h2>
              <p className="text-xs text-gray-500">
                Product ID:{" "}
                <span className="font-mono">
                  {conversations[selectedCustomer]?.[0]?.productId || "N/A"}
                </span>
              </p>
            </div>

            <div className="max-h-64 overflow-y-auto space-y-2 mb-3">
              {conversations[selectedCustomer]?.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${
                    msg.sender === "seller" ? "items-end" : "items-start"
                  }`}
                >
                  <span
                    className={`px-4 py-2 rounded-xl text-sm max-w-xs break-words shadow ${
                      msg.sender === "seller"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-black"
                    }`}
                  >
                    {msg.text}
                  </span>
                  <small className="text-xs text-gray-400">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </small>
                </div>
              ))}
            </div>

            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(selectedCustomer);
              }}
            >
              <input
                type="text"
                placeholder="Type your message..."
                value={inputs[selectedCustomer] || ""}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    [selectedCustomer]: e.target.value,
                  }))
                }
                className="flex-grow border rounded-md px-4 py-2"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Send
              </button>
            </form>
          </div>
        ) : (
          <div className="text-gray-500 flex items-center justify-center h-full">
            Select a customer to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerChat;
