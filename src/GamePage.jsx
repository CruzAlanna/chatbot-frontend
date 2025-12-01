import axios from "axios";
import { useState } from "react";

axios.defaults.baseURL = "http://localhost:8000";

export function GamePage() {
  const [messages, setMessages] = useState([]);
  const [scenarioId, setScenarioId] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [nextScenarioId, setNextScenarioId] = useState(null);

  const handleSendMessage = (params, successCallback = () => {}) => {
    axios.post("/play", params)
      .then((response) => {
        const data = response.data;

        // Add assistant response
        const assistantMessage = {
          role: "assistant",
          content: data.message,
        };
        setMessages((prev) => [...prev, assistantMessage]);

        // Update scenario info
        setScenarioId(data.scenario_id);

        // If the game has finished (after 5 rounds)
        if (data.game_over) {
          setGameOver(true);
          setNextScenarioId(data.next_scenario_id);
        }

        successCallback();
      })
      .catch((err) => console.error("Error:", err));
  };


  // Start the game
  const handleStart = () => {
    setGameStarted(true);
    setGameOver(false);
    setMessages([]);

    // Send initial "start" message
    handleSendMessage({
      message: "start",
      scenario_id: "new"
    });
  };


  // Send a regular round message
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    const msg = formData.get("message");

    setMessages((prev) => [...prev, { role: "user", content: msg }]);

    handleSendMessage(
      {
        message: msg,
        scenario_id: scenarioId,
      },
      () => event.target.reset()
    );
  };


  // Handle "Play Again"
  const handlePlayAgain = () => {
    setMessages([]);
    setGameOver(false);
    setScenarioId(nextScenarioId);

    // Restart immediately using given nextScenarioId
    handleSendMessage({
      message: "start",
      scenario_id: nextScenarioId,
    });
  };


  // Handle "Exit"
  const handleExit = () => {
    setMessages([]);
    setGameStarted(false);
    setGameOver(false);
    setScenarioId(null);
    setNextScenarioId(null);
  };


  return (
    <main>
      <h1>SURVIVAL</h1>

      {/* Messages */}
      <div>
        <h2>Would you survive the end of the world??</h2>

        <div className="scenario">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${
                msg.role === "user" ? "user-message" : "assistant-message"
              }`}
            >
              <strong>{msg.role === "user" ? "You" : "Assistant"}:</strong>{" "}
              {msg.content}
            </div>
          ))}
        </div>
      </div>


      {/* BEFORE GAME STARTS */}
      {!gameStarted && (
        <div style={{ marginTop: "20px" }}>
          <button onClick={handleStart}>Start Game</button>
        </div>
      )}


      {/* DURING GAME — BUT NOT GAME OVER */}
      {gameStarted && !gameOver && (
        <div>
          <h2>Send a message</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-area">
              <input
                name="message"
                type="text"
                placeholder="Choose an option..."
                required
              />
              <button type="submit">Send</button>
            </div>
          </form>
        </div>
      )}


      {/* GAME OVER → Play Again or Exit */}
      {gameOver && (
        <div style={{ marginTop: "20px" }}>
          <h2>Game Over</h2>
          <button onClick={handlePlayAgain} style={{ marginRight: "10px" }}>
            Play Again
          </button>
          <button onClick={handleExit}>Exit</button>
        </div>
      )}
    </main>
  );
}
