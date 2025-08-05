import React, { useState } from "react";
import { IoChatbubblesOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { FaPaperPlane } from "react-icons/fa";
import useAxios from "../../Hooks/useAxios";

const AIAssistant = () => {
  const axiosInstance=useAxios()
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I'm your AI shopping assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const res = await axiosInstance.post("/api/ai-chat", { message: input }); // You’ll connect this to your n8n webhook
      console.log(res.data);
      const botReply = res.data.reply;
      setMessages((prev) => [...prev, { role: "assistant", text: botReply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Oops! Something went wrong. Try again later." },
      ]);
    }
  };

  return (
    <div>
      {/* Floating Button */}
      <button
      title="Chat With AI Assistant"
        className="fixed bottom-6 right-6 z-50 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {open ? <IoClose size={24} /> : <IoChatbubblesOutline size={24} />}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-6 w-5/12 h-8/12 bg-white rounded-xl shadow-lg flex flex-col overflow-hidden z-40">
          <div className="bg-orange-500 text-white p-3 font-semibold">
            AI Assistant
          </div>
          <div className="flex-1 p-2 overflow-y-auto space-y-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-md max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-gray-200 self-end ml-auto"
                    : "bg-orange-100 self-start mr-auto"
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="p-2 flex gap-2 border-t">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask something..."
              className="flex-1 px-3 py-2 border rounded"
            />
            <button
              onClick={sendMessage}
              className="text-orange-500 hover:text-orange-600"
            >
              <FaPaperPlane size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
