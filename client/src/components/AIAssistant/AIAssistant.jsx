import React, { useState, useEffect, useRef } from "react";
import { IoChatbubblesOutline, IoImageOutline, IoClose } from "react-icons/io5";
import { FaPaperPlane } from "react-icons/fa";
import useAxios from "../../Hooks/useAxios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const AIAssistant = () => {
  const axiosInstance = useAxios();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hi! I'm your AI shopping assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(null); // Image preview
  const messagesEndRef = useRef(null);
  const imageInputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result); // show preview
    };
    reader.readAsDataURL(file);
  };

  const sendImage = async () => {
    if (!previewImage) return;

    setMessages((prev) => [...prev, { role: "user", text: "📷 Image sent..." }]);
    setIsLoading(true);

    try {
      const res = await axiosInstance.post("/api/ai-chat", {
        image: previewImage.split(",")[1],
      });
      setMessages((prev) => [...prev, { role: "assistant", text: res.data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "❌ Failed to process image." }]);
    } finally {
      setPreviewImage(null);
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await axiosInstance.post("/api/ai-chat", { message: input });
      setMessages((prev) => [...prev, { role: "assistant", text: res.data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "❌ Something went wrong." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        title="Chat With AI Assistant"
        className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-orange-500 to-pink-500 text-white p-4 rounded-full shadow-lg hover:scale-105 transform transition"
        onClick={() => setOpen(!open)}
      >
        {open ? <IoClose size={24} /> : <IoChatbubblesOutline size={24} />}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-20 right-6 w-11/12 md:w-5/12 lg:w-4/12 h-3/4 
                        bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/30
                        flex flex-col overflow-hidden z-40 animate-fadeIn">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white p-4 font-semibold flex justify-between items-center">
            AI Assistant
            <button onClick={() => setOpen(false)} className="hover:text-gray-200">
              <IoClose size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg max-w-[85%] text-sm shadow-sm animate-slideUp ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-blue-500 to-blue-400 text-white self-end ml-auto"
                    : "bg-gray-100 text-gray-800 self-start mr-auto"
                }`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse mx-1"></div>
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse mx-1 delay-150"></div>
                <div className="w-3 h-3 bg-gray-400 rounded-full animate-pulse mx-1 delay-300"></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Image Preview */}
          {previewImage && (
            <div className="p-3 border-t bg-white flex justify-between items-center">
              <img src={previewImage} alt="preview" className="w-16 h-16 object-cover rounded-lg shadow-md" />
              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewImage(null)}
                  className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={sendImage}
                  className="px-3 py-1 text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
                >
                  Send
                </button>
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 flex gap-2 border-t bg-white">
            <input
              type="file"
              accept="image/*"
              ref={imageInputRef}
              style={{ display: "none" }}
              onChange={handleImageUpload}
            />
            <button
              onClick={() => imageInputRef.current?.click()}
              className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700"
              title="Upload Image"
              disabled={isLoading}
            >
              <IoImageOutline size={18} />
            </button>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder={isLoading ? "Thinking..." : "Ask something..."}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              className={`p-3 rounded-full transition ${
                isLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-orange-500 to-pink-500 hover:scale-105 text-white"
              }`}
              disabled={isLoading}
            >
              <FaPaperPlane size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
