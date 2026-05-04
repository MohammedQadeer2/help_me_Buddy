import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import Avatar from "../components/Avatar";
import Button from "../components/Button";

function Chat() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const partner = location.state?.partner || { name: "Support", role: "admin", profileImage: null };
  const bottomRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: partner.name,
      senderId: partner.id || "admin",
      text: `Hi ${user?.name || "there"}, how can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = {
      id: Date.now(),
      sender: user?.name,
      senderId: user?.id || "me",
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate partner reply
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: partner.name,
          senderId: partner.id || "admin",
          text: "I received your message! I'll be right on it.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex justify-center text-white h-screen overflow-hidden">
      <div className="w-full max-w-2xl px-4 py-4 md:py-8 flex flex-col h-full">
        
        {/* Chat Header */}
        <div className="flex items-center gap-4 border-b border-gray-800 pb-4 mb-4">
          <button 
            onClick={() => navigate(-1)}
            className="text-gray-400 hover:text-white p-2 rounded-lg bg-gray-900 border border-gray-800"
          >
            ← Back
          </button>
          <Avatar src={partner.profileImage} size="md" />
          <div>
            <h2 className="text-lg font-semibold">{partner.name}</h2>
            <p className="text-xs text-green-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> Online
            </p>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2">
          <AnimatePresence>
            {messages.map((msg) => {
              const isMe = msg.senderId === (user?.id || "me");
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[75%] rounded-2xl p-4 shadow-sm ${
                    isMe 
                      ? "bg-blue-600 rounded-br-none text-white" 
                      : "bg-gray-800 rounded-bl-none border border-gray-700 text-gray-200"
                  }`}>
                    <p className="text-sm font-medium mb-1 opacity-75 hidden">{msg.sender}</p>
                    <p className="text-md leading-relaxed">{msg.text}</p>
                    <p className="text-xs opacity-50 text-right mt-2">{msg.timestamp}</p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-start"
            >
              <div className="bg-gray-800 rounded-2xl rounded-bl-none p-4 w-16 flex justify-around border border-gray-700">
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-2 h-2 bg-gray-500 rounded-full" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-gray-500 rounded-full" />
                <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-gray-500 rounded-full" />
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} className="h-1" />
        </div>

        {/* Input Area */}
        <form onSubmit={sendMessage} className="flex gap-2 bg-gray-900 p-2 rounded-xl border border-gray-800 relative z-10">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-transparent px-4 py-2 outline-none text-gray-200 placeholder-gray-500"
          />
          <Button type="submit" variant="primary">Send</Button>
        </form>

      </div>
    </div>
  );
}

export default Chat;