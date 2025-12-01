// src/components/GameOverScreen.jsx
import React from "react";
import "../styles/Controls.css";

export default function GameOverScreen({ playAgain, handleExit }) {
  return (
    <div>
      <button className="game-over-button" onClick={playAgain}>
        🔄 Play Again
      </button>
      <button className="game-over-button" onClick={handleExit}>Exit</button>
    </div>
  );
}

