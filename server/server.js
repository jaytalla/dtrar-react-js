// server.js
import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/generate", async (req, res) => {
  const { task } = req.body;
  console.log("Received task:", task);

  if (!task) return res.status(400).json({ error: "Task is required" });

  const prompt = `...`; // your Gemini prompt

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    console.log("AI response:", response);
    res.status(200).json({ description: response.text });
  } catch (err) {
    console.error("Error generating description:", err); // <- log the full error
    res.status(500).json({ error: err.message });
  }
});


app.listen(3001, () => console.log("Server running on http://localhost:3001"));
