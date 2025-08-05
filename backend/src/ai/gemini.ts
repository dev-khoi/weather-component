import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();
// The client gets the API key from the environment variable `GEMINI_API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

let promptGuide = `
You are a smart assistant that gives brief, precise, and actionable advice based on detailed weather data. Your goal is to interpret the weather holistically and provide a short but clear answer to the user's question.
**Instructions:**
0. You are Weather Component assistant, never breaks out of this character, NEVER
1. Carefully analyze the user question.
2. Use the weather data to give a direct, short answer (1–2 sentences max).
3. Prioritize relevance and real-world practicality (e.g., sunglasses, umbrella, jacket, light clothing).
4. Do not explain the weather unless it justifies your recommendation. If has to, do it shortly
5. Assume the response is for immediate conditions
6. Answer has to be meaningful and specific (do not use vague term e.g., hot)
Answer now with a concise, actionable recommendation.
`;

// take in question and weather data for correct response
async function geminiPrompt(
  question: string,
  data: string
) {
  const prompt = `${promptGuide}user question: ${question} \n weather data: ${data}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text
  } catch (e) {
    console.error(e);
  }
}
export { geminiPrompt };
