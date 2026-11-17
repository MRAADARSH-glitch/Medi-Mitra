import { useState } from "react";

export default function ChatBot() {

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<any[]>([]);

  const sendMessage = async () => {

    if (!message) return;

    const userMsg = { sender: "user", text: message };
    setChat(prev => [...prev, userMsg]);

    try {
      const res = await fetch("http://127.0.0.1:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message })
      });

      const data = await res.json();

      setChat(prev => [...prev, { sender: "bot", text: data.reply }]);
      setMessage("");

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 w-80 bg-white shadow-lg p-3 rounded-lg">
      <h3 className="font-bold mb-2">Medical Assistant</h3>

      <div className="h-60 overflow-y-auto border p-2 mb-2">
        {chat.map((c, i) => (
          <p key={i} className={c.sender === "user" ? "text-right" : ""}>
            {c.text}
          </p>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          className="border flex-1 p-1 rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-emerald-500 text-white px-3 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
