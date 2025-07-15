// src/components/GeminiResponse.jsx
import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ⚠️ Ideally load from .env using Vite's import.meta.env
const genAI = new GoogleGenerativeAI({
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
});

const GeminiResponse = () => {
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const getGeminiAnswer = async () => {
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const result = await model.generateContent("Explain how AI works in a few words");
      const res = await result.response;
      setResponse(res.text());
    } catch (error) {
      setResponse("Error: " + error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "1rem", maxWidth: "500px" }}>
      <button onClick={getGeminiAnswer} disabled={loading}>
        {loading ? "Loading..." : "Ask Gemini"}
      </button>

      {response && (
        <div style={{ marginTop: "1rem", background: "#f0f0f0", padding: "1rem", borderRadius: "8px" }}>
          <strong>Response:</strong>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

export default GeminiResponse;
