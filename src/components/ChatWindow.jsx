// src/components/ChatWindow.jsx
import React from "react";
import MessageBubble from "./MessageBubble";
import "../styles/ChatWindow.css";

export default function ChatWindow({ messages, loading, chatEndRef }) {
  return (
    <div className="chat-box">
      {messages.map((msg, i) => (
        <MessageBubble key={i} role={msg.role} content={msg.content} />
      ))}

      {loading && <div className="typing-indicator">Game is typing...</div>}

      <div ref={chatEndRef} />
    </div>
  );
}
