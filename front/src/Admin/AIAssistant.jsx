import { useState } from "react";
import { Bot, X, Send, Sparkles, User } from "lucide-react";

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hello! I'm your Beauty Online Shop AI Assistant. How can I help you today?",
    },
  ]);

  const handleSend = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: message.trim() }]);

    setMessage("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">
      {isOpen && (
        <div className="absolute bottom-20 right-0 flex h-[480px] w-[350px] max-w-[calc(100vw-32px)] flex-col overflow-hidden rounded-2xl border border-purple-100 bg-white shadow-2xl">
          <div className="flex items-center justify-between bg-gradient-to-r from-purple-700 to-purple-500 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white/20 p-2">
                <Sparkles size={22} />
              </div>

              <div>
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-xs text-purple-100">Beauty Online Shop</p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1 transition hover:bg-white/20"
            >
              <X size={22} />
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-3 overflow-y-auto bg-purple-50/40 p-4">
            {messages.map((item, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 ${
                  item.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`rounded-full p-2 ${
                    item.role === "user"
                      ? "bg-purple-600 text-white"
                      : "bg-purple-100 text-purple-700"
                  }`}
                >
                  {item.role === "user" ? (
                    <User size={16} />
                  ) : (
                    <Bot size={16} />
                  )}
                </div>

                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-6 ${
                    item.role === "user"
                      ? "rounded-tr-sm bg-purple-600 text-white"
                      : "rounded-tl-sm bg-white text-gray-700 shadow-sm"
                  }`}
                >
                  {item.text}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 border-t border-purple-100 bg-white p-3"
          >
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask your AI assistant..."
              className="min-w-0 flex-1 rounded-xl border border-purple-100 px-3 py-3 text-sm outline-none transition focus:border-purple-400"
            />

            <button
              type="submit"
              disabled={!message.trim()}
              className="rounded-xl bg-purple-600 p-3 text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-600 to-purple-800 text-white shadow-xl transition duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-purple-300"
        aria-label="Toggle AI Assistant"
      >
        {isOpen ? <X size={28} /> : <Sparkles size={28} />}
      </button>
    </div>
  );
}
