import { useState } from "react";
import { Bot, Send, X } from "lucide-react";

export default function ChatBot() {
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "bot",
      text: "مرحبًا 👋 كيف يمكنني مساعدتك اليوم؟",
    },
  ]);

  const [input, setInput] = useState("");

  const handleSend = (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "bot",
          text: "شكرًا لرسالتك، سيتم ربط الردود بالـ API لاحقًا.",
        },
      ]);
    }, 700);

    setInput("");
  };

  return (
    <>
      {/* Floating Button */}

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 left-6 z-50 bg-blue-600 hover:bg-blue-700 text-white w-16 h-16 rounded-full shadow-xl flex items-center justify-center transition-all"
      >
        {open ? <X size={26} /> : <Bot size={30} />}
      </button>

      {/* Chat */}

      {open && (
        <div className="fixed bottom-24 left-6 w-[360px] h-[520px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden z-50">

          {/* Header */}

          <div className="bg-blue-600 text-white p-4 flex items-center gap-3">

            <div className="bg-white text-blue-600 rounded-full p-2">
              <Bot size={24} />
            </div>

            <div>
              <h2 className="font-bold">مساعد عمرها</h2>
              <p className="text-xs opacity-80">
                متصل الآن
              </p>
            </div>

          </div>

          {/* Messages */}

          <div
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
            dir="rtl"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user"
                    ? "justify-start"
                    : "justify-end"
                }`}
              >
                <div
                  className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-6 ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-bl-sm"
                      : "bg-white shadow rounded-br-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}

          <form
            onSubmit={handleSend}
            className="border-t p-3 flex gap-2"
          >
            <button
              className="bg-blue-600 text-white rounded-full w-11 h-11 flex items-center justify-center"
            >
              <Send size={18} />
            </button>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اكتب رسالتك..."
              className="flex-1 border rounded-full px-4 outline-none"
            />
          </form>
        </div>
      )}
    </>
  );
}