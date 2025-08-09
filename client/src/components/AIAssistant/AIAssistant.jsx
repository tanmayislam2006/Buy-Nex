import React, { useState, useEffect, useRef } from "react";
import { IoChatbubblesOutline, IoImageOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { FaPaperPlane } from "react-icons/fa";
import useAxios from "../../Hooks/useAxios";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const AIAssistant = () => {
  const axiosInstance = useAxios();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I'm your AI shopping assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New state for loading indicator
  const messagesEndRef = useRef(null);
  const imageInputRef = useRef(null); // Ref for the hidden file input

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Convert the image file to a Base64 string
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result.split(',')[1]; // Get the Base64 data part

      // Add a user message to the chat with an image placeholder
      const userMessage = { role: "user", text: "Image sent..." };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const res = await axiosInstance.post("/api/ai-chat", {
          image: base64Image, // Send the Base64 image
          // You can also add a sessionId here if you have one
        });
        const botReply = res.data.reply;
        setMessages((prev) => [...prev, { role: "assistant", text: botReply }]);
      } catch (error) {
        console.error("Error communicating with AI assistant:", error);
        setMessages((prev) => [
          ...prev,
          { role: "assistant", text: "Oops! Something went wrong with the image search. Try again later." },
        ]);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsDataURL(file); // Start the conversion
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await axiosInstance.post("/api/ai-chat", {
        message: userMessage.text,
      });
      const botReply = res.data.reply;
      setMessages((prev) => [...prev, { role: "assistant", text: botReply }]);
    } catch (error) {
      console.error("Error communicating with AI assistant:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Oops! Something went wrong. Please try again later." },
      ]);
    } finally {
      setIsLoading(false);
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
        <div className="fixed bottom-20 right-6 w-11/12 md:w-5/12 lg:w-4/12 h-3/4 bg-white rounded-xl shadow-lg flex flex-col overflow-hidden z-40 border border-gray-200">
          <div className="bg-orange-500 text-white p-3 font-semibold flex justify-between items-center">
            AI Assistant
            <button onClick={() => setOpen(false)} className="text-white hover:text-gray-200">
              <IoClose size={20} />
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg max-w-[85%] text-sm ${
                  msg.role === "user"
                    ? "bg-blue-100 self-end ml-auto text-blue-800"
                    : "bg-gray-100 self-start mr-auto text-gray-800"
                }`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
              </div>
            ))}
            {isLoading && (
            <span className="loading loading-dots loading-xl"></span>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 flex gap-2 border-t border-gray-200 bg-white">
            <input
              type="file"
              accept="image/*"
              ref={imageInputRef}
              style={{ display: 'none' }}
              onChange={handleImageUpload}
            />
            <button
              onClick={() => imageInputRef.current?.click()}
              className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700"
              title="Upload Image"
              disabled={isLoading}
            >
              <IoImageOutline size={18} />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={isLoading ? "Searching..." : "Ask something..."}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              className={`p-2 rounded-full ${isLoading ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600 text-white"}`}
              disabled={isLoading}
            >
              <FaPaperPlane size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIAssistant;
