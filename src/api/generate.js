// server/server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3001;

app.use(cors()); // allow requests from frontend
app.use(bodyParser.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.post("/generate", async (req, res) => {
  const { task } = req.body;
  console.log("Received task:", task);

  if (!task) return res.status(400).json({ error: "Task is required" });

  const prompt = `
You are writing a professional accomplishment report entry in the first person, as the person who completed the task.
Use only the information provided in the input. Do not assume or invent technologies, tools, methods, or outcomes that are not mentioned.
Avoid placeholders like [mention tools] or generalizations. Be concise, human-sounding, and professional.
The output should be a complete paragraph between 30 and 60 words. Only return the final description.

Task: ${task}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    console.log("AI response:", response);
    res.status(200).json({ description: response.text });
  } catch (err) {
    console.error("Error generating description:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
