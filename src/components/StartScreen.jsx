// src/components/StartScreen.jsx
import React from "react";
import "../styles/Controls.css";

export default function StartScreen({ startGame }) {
  return (
    <button className="start-button" onClick={startGame}>
      Start Game
    </button>
  );
}
