// /api/answer.js — Decodes the ID, sends question to Gemini, returns the answer

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// System prompts based on question type
const SYSTEM_PROMPTS = {
  code: `You are a coding assistant. The user will ask a programming question.
Respond ONLY with the code solution. No explanations, no markdown fences, no comments unless they are part of the code.
Just raw, clean, working code.`,

  mcq: `You are an MCQ solver. The user will provide a multiple choice question.
Respond ONLY with the correct option letter and the answer text, like:
B) Answer text here
Do not explain why. Just give the correct option.`,

  default: `You are a helpful assistant. Answer the user's question concisely and directly in plain text. No markdown formatting.`,
};

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "text/plain; charset=utf-8");

  try {
    const { id } = req.query;

    if (!id) {
      res.status(400).send("Error: Missing query parameter 'id'. First call /xxx/get?q=your-question&t=code to get an ID.");
      return;
    }

    if (!process.env.GEMINI_API_KEY) {
      res.status(500).send("Error: GEMINI_API_KEY is not configured on the server.");
      return;
    }

    // Decode the ID back into the question and type
    let payload;
    try {
      const decoded = Buffer.from(id, "base64url").toString("utf-8");
      payload = JSON.parse(decoded);
    } catch (e) {
      res.status(400).send("Error: Invalid ID. Please generate a new one using /xxx/get?q=your-question&t=code");
      return;
    }

    const { q, t } = payload;
    const type = (t || "default").toLowerCase().trim();
    const systemInstruction = SYSTEM_PROMPTS[type] || SYSTEM_PROMPTS.default;

    // Call Gemini with the decoded question
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: q,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2,
      },
    });

    const text = response.text ?? "No response generated.";
    res.status(200).send(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).send("Error: Failed to generate response. " + (error.message || ""));
  }
}
