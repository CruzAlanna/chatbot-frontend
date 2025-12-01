// src/pages/GamePage.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

// Components
import ChatWindow from "../components/ChatWindow";
import GameControls from "../components/GameControls";
import GameOverScreen from "../components/GameOverScreen";
import StartScreen from "../components/StartScreen";

// Background image
import backgroundImage from "../art/desolate_city.jpg";

// =============== CONFIG ===================
const API_URL = "http://localhost:8000"; // Update for deployment
// ==========================================

export default function GamePage() {
  const [scenarioId, setScenarioId] = useState(localStorage.getItem("scenarioId") || "");
  const [messages, setMessages] = useState(JSON.parse(localStorage.getItem("messages") || "[]"));
  const [input, setInput] = useState("");
  const [round, setRound] = useState(Number(localStorage.getItem("round") || 0));
  const [gameOver, setGameOver] = useState(localStorage.getItem("gameOver") === "true");
  const [nextScenarioId, setNextScenarioId] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem("scenarioId", scenarioId);
    localStorage.setItem("messages", JSON.stringify(messages));
    localStorage.setItem("round", round);
    localStorage.setItem("gameOver", gameOver);
  }, [scenarioId, messages, round, gameOver]);

  useEffect(() => {
    localStorage.clear();
  }, []); // run only once on mount

  // -------- Start Game --------
  const startGame = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/play`, {
        message: "start",
        scenario_id: "",
      });

      setScenarioId(response.data.scenario_id);
      setMessages([{ role: "assistant", content: response.data.message }]);
      setRound(response.data.round);
      setGameOver(response.data.game_over);
      setNextScenarioId(response.data.next_scenario_id || "");
    } catch (e) {
      console.error("Failed to start game", e);
    }
    setLoading(false);
  };

  // -------- Send User Action --------
  const sendMessage = async (content = input) => {
    if (!content.trim() || !scenarioId || gameOver) return;

    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", content }]);
    setInput("");

    try {
      const response = await axios.post(`${API_URL}/play`, {
        message: content,
        scenario_id: scenarioId,
      });

      await simulateTyping(response.data.message);

      setRound(response.data.round);
      setGameOver(response.data.game_over);
      setNextScenarioId(response.data.next_scenario_id || "");
    } catch (e) {
      console.error("Failed to send message", e);
    }
    setLoading(false);
  };

  // Typing animation
  async function simulateTyping(fullText) {
    let temp = "";
    for (let c of fullText) {
      temp += c;
      setMessages((prev) => [
        ...prev.filter((m, i) => i !== prev.length - 1),
        { role: "assistant", content: temp },
      ]);
      await new Promise((res) => setTimeout(res, 15));
    }
  }

  const playAgain = () => {
    localStorage.clear();
    setScenarioId("");
    setMessages([]);
    setRound(0);
    setGameOver(false);
    setNextScenarioId("");
    startGame();
  };

  // Handle "Exit"
  const handleExit = () => {
    localStorage.clear();
    setScenarioId("");
    setMessages([]);
    setRound(0);
    setGameOver(false);
    setNextScenarioId("");
  };

  return (
    <div style={wrapperStyle()}>
      <div style={containerStyle}>
        <h1 style={titleStyle}>🔥 Survival Game 🔥</h1>

        {/* START SCREEN */}
        {!scenarioId && <StartScreen startGame={startGame} />}

        {/* ROUND INDICATOR */}
        {scenarioId && !gameOver && <div style={roundStyle}>Round {round} / 5</div>}

        {/* CHAT WINDOW */}
        <ChatWindow messages={messages} loading={loading} chatEndRef={chatEndRef} />

        {/* GAME OVER */}
        {gameOver ? (
          <GameOverScreen playAgain={playAgain} handleExit={handleExit}/>
        ) : (
          scenarioId && (
            <GameControls input={input} setInput={setInput} sendMessage={sendMessage} disabled={loading} />
          )
        )}
      </div>
    </div>
  );
}

// ===================== STYLES ==========================
const wrapperStyle = () => ({
  minHeight: "100vh",
  backgroundImage: `url(${backgroundImage})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const containerStyle = {
  width: "95%",
  maxWidth: "750px",
  backgroundColor: "rgba(0,0,0,0.85)",
  padding: "25px",
  borderRadius: "12px",
  color: "white",
};

const titleStyle = { textAlign: "center", marginBottom: "15px" };

const roundStyle = {
  textAlign: "center",
  fontSize: "18px",
  marginBottom: "10px",
};
