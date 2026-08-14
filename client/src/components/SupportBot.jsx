import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot } from "lucide-react";
import api from "../api/axios";

const SupportBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! Need help with SkillSwap? Ask me anything about Swaps, Scheduling, or Chat!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll to latest message on mobile & desktop
  useEffect(() => {
    if (open) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open, loading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/chat/support", { query: userMsg });
      setMessages((prev) => [...prev, { sender: "bot", text: res.data.reply }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Sorry, I am having trouble connecting right now." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold px-4 py-3 rounded-full shadow-2xl transition-transform transform hover:scale-105 active:scale-95"
        >
          <Bot size={22} />
          <span className="text-xs sm:text-sm font-bold">Support AI</span>
        </button>
      ) : (
        /* Mobile-Ready Chat Modal Container */
        <div className="w-[calc(100vw-2rem)] sm:w-96 max-w-[400px] bg-[#111B38] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[450px] max-h-[80vh]">
          
          {/* Header */}
          <div className="bg-[#182342] p-3.5 border-b border-gray-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <Bot size={18} />
              <span>SkillSwap Assistant</span>
            </div>
            <button 
              type="button" 
              onClick={() => setOpen(false)} 
              className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] p-2.5 sm:p-3 rounded-xl text-xs sm:text-sm leading-relaxed break-words ${
                    m.sender === "user"
                      ? "bg-emerald-500 text-black font-medium"
                      : "bg-gray-800 text-gray-200 border border-gray-700"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-800/60 border border-gray-700/50 p-2.5 rounded-xl text-xs text-emerald-400 animate-pulse flex items-center gap-2">
                  <Bot size={14} />
                  Assistant typing...
                </div>
              </div>
            )}
            
            <div ref={chatEndRef} />
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSend} className="p-2.5 border-t border-gray-800 flex items-center gap-2 bg-[#0B132B] shrink-0">
            <input
              type="text"
              placeholder="Ask a question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-gray-900 border border-gray-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-white outline-none focus:border-emerald-500"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black p-2.5 rounded-lg active:scale-95 transition-transform"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SupportBot;