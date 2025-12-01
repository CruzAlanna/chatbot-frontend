import axios from "axios";
import { useState } from "react";

// Backend URL
axios.defaults.baseURL = "http://localhost:8000";

export function GamePage() {
  const [messages, setMessages] = useState([]);
  const [scenarioId] = useState("user-" + Date.now());
  const [gameStarted, setGameStarted] = useState(false);

  const handleSendMessage = (params, successCallback = () => {}) => {
    console.log("handleSendMessage", params);

    // Add user message (if user actually typed something)
    if (params.message !== "start") {
      const userMessage = { role: "user", content: params.message };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
    }

    // Send to the API
    axios.post("/play", params)
      .then((response) => {
        console.log(response.data);

        const assistantMessage = {
          role: "assistant",
          content: response.data.message,
        };

        setMessages((prev) => [...prev, assistantMessage]);
        successCallback();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleStart = () => {
    setGameStarted(true);

    // Send the initial "start" signal
    handleSendMessage(
      {
        message: "start",
        scenario_id: scenarioId,
      }
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const message = formData.get("message");

    handleSendMessage(
      {
        message,
        scenario_id: scenarioId,
      },
      () => event.target.reset()
    );
  };

  return (
    <main>
      <h1>SURVIVAL</h1>

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

      {/* Before starting, show only the start button */}
      {!gameStarted && (
        <div style={{ marginTop: "20px" }}>
          <button onClick={handleStart}>Start Game</button>
        </div>
      )}

      {/* After starting, show text input */}
      {gameStarted && (
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
    </main>
  );
}
