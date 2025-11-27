import axios from "axios";
import { useState } from "react";

// Set the default URL for your FastAPI backend
axios.defaults.baseURL = "http://localhost:8000";

export function ChatbotPage() {
  const [messages, setMessages] = useState([]);
  const [conversationId] = useState("user-" + Date.now());

  const handleSendMessage = (params, successCallback) => {
    console.log("handleSendMessage", params);
    
    // Add user message to display immediately
    const userMessage = { role: "user", content: params.message };
    setMessages([...messages, userMessage]);
    
    // Send to API and get response
    axios.post("/chat", params).then((response) => {
      console.log(response.data);
      // Add assistant message to display
      const assistantMessage = { role: "assistant", content: response.data.message };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      successCallback();
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const params = {
      message: formData.get("message"),
      conversation_id: conversationId
    };
    const successCallback = () => form.reset();
    handleSendMessage(params, successCallback);
  };

  return (
    <main>
      <h1>Robert Chatbot</h1>
      
      <div>
        <h2>Conversation</h2>
        {messages.map((message, index) => (
          <div key={index}>
            <strong>{message.role === "user" ? "You" : "Assistant"}:</strong> {message.content}
          </div>
        ))}
      </div>

      <div>
        <h2>Send a message</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <input name="message" type="text" placeholder="Type your message..." />
          </div>
          <button type="submit">Send</button>
        </form>
      </div>
    </main>
  );
}