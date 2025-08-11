import React, { useState, useEffect, useRef } from "react";
import { IoChatbubblesOutline, IoImageOutline, IoClose } from "react-icons/io5";
import { FaPaperPlane } from "react-icons/fa";
import { RiRobot2Line } from "react-icons/ri";
import useAxios from "../../Hooks/useAxios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const AIAssistant = () => {
  const axiosInstance = useAxios();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! I'm your AI shopping assistant. How can I help you today?",
    },
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

    setMessages((prev) => [
      ...prev,
      { role: "user", text: "📷 Image sent..." },
    ]);
    setIsLoading(true);

    try {
      const res = await axiosInstance.post("/api/ai-chat", {
        image: previewImage.split(",")[1],
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: res.data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "❌ Failed to process image." },
      ]);
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
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: res.data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "❌ Something went wrong." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-4 md:right-8 z-50">
        <button
          title="Chat With AI Assistant"
          className={`bg-primary text-white p-4 rounded-full shadow-lg transition-transform duration-500 ${
            open
              ? "scale-90 opacity-0 pointer-events-none"
              : "scale-100 opacity-100"
          }`}
          style={{
            position: "relative",
            zIndex: 51,
            transition: "transform 0.5s, opacity 0.5s",
          }}
          onClick={() => setOpen(true)}
        >
          <IoChatbubblesOutline size={26} />
        </button>
      </div>
      {/* Chat Window overlays screen on mobile, fixed position */}
      <div
        className={`fixed bottom-2 right-2 sm:bottom-6 sm:right-8 w-[calc(100%-30px)] h-[70vh] mx-auto sm:w-[95vw] sm:max-w-md md:max-w-lg lg:max-w-xl bg-white backdrop-blur-md rounded-lg shadow-2xl border border-white/30 flex flex-col overflow-hidden transition-all duration-500 origin-bottom-right ${
          open
            ? "opacity-100 scale-100 pointer-events-auto animate-fadeIn"
            : "opacity-0 scale-0 pointer-events-none"
        }`}
        style={{
          visibility: open ? "visible" : "hidden",
          zIndex: 100,
        }}
      >
        {/* Header */}
        <div className="bg-primary text-white px-4 sm:px-5 py-3 sm:py-4 font-semibold flex justify-between items-center">
          <span className="text-base sm:text-lg">AI Assistant</span>
          <button
            onClick={() => setOpen(false)}
            className="hover:text-gray-200"
          >
            <IoClose size={22} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 px-2 sm:px-4 py-2 sm:py-3 overflow-y-auto space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-center w-fit max-w-[90%] sm:max-w-[80%] text-xs sm:text-sm animate-slideUp ${
                msg.role === "user" ? "self-end ml-auto" : "self-start mr-auto"
              }`}
            >
              {msg.role === "assistant" && (
                <span className="mr-2 p-2 rounded-full bg-primary text-white">
                  <RiRobot2Line size={20} />
                </span>
              )}
              <div
                className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-md ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-blue-500 to-blue-400 text-white self-end ml-auto"
                    : "bg-gray-100 text-gray-800 self-start mr-auto"
                }`}
              >
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {msg.text}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center w-fit max-w-[80%] text-sm animate-slideUp self-start mr-auto">
              <span className="mr-2 p-2 rounded-full bg-primary text-white">
                <RiRobot2Line size={20} />
              </span>
              <div className="px-3.5 py-1 rounded-md bg-gray-100 w-fit self-start flex items-center gap-2">
                <span className="loading loading-dots loading-xl text-gray-800"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        {previewImage && (
          <div className="p-2 sm:p-3 border-t bg-white flex flex-col sm:flex-row gap-2 sm:gap-3 items-center">
            <img
              src={previewImage}
              alt="preview"
              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-xl shadow-md"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setPreviewImage(null)}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gray-200 hover:bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={sendImage}
                className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
              >
                Send
              </button>
            </div>
          </div>
        )}
        {/* Input */}
        <div className="w-full px-2 sm:px-3 py-2 sm:py-3 flex gap-2 border-t bg-white">
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
            <IoImageOutline size={20} />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder={isLoading ? "Thinking..." : "Ask something..."}
            className="flex-1 px-2 sm:px-4 py-1.5 sm:py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-400 text-xs sm:text-base"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            className={`p-3 rounded-full transition ${
              isLoading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-primary text-white"
            }`}
            disabled={isLoading}
          >
            <FaPaperPlane size={20} />
          </button>
        </div>
      </div>
    </>
  );
};

export default AIAssistant;
