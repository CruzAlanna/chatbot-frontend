// src/components/GameControls.jsx
import React from "react";
import "../styles/Controls.css";

export default function GameControls({ input, setInput, sendMessage, disabled }) {
  return (
    <div className="input-container">
      <input
        value={input}
        placeholder="Your action..."
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && !disabled && sendMessage()}
        disabled={disabled} // disable during AI typing
      />
      <button onClick={() => !disabled && sendMessage()} disabled={disabled}>
        Send
      </button>
    </div>
  );
}
