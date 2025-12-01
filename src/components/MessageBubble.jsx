// src/components/MessageBubble.jsx
import React from "react";
import "../styles/Messages.css";

export default function MessageBubble({ role, content }) {
  return (
    <div
      className={`message-bubble ${role === "user" ? "user" : "assistant"}`}
    >
      <strong>{role === "user" ? "You" : "Game"}</strong>:
      <div className="message-text">{content}</div>
    </div>
  );
}
