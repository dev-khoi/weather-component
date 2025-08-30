import express from "express";
import { CustomError, Layout } from "./types/type.js";

// SECRET KEY
import dotenv from "dotenv";
dotenv.config();
const frontend = process.env.FRONTEND_URL!;

import cors from "cors";
const corsOption = {
  origin: [frontend],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

import cookieParser from "cookie-parser";
import { verifyAccessToken } from "./lib/passwordUtils.js";
import { authRoute } from "./authServer/authServer.js";
import { errorHandler } from "./authServer/authErrorHandler.js";
import { geminiPrompt } from "./ai/gemini.js";
import { layoutRoute } from "./routes/layouts/index.js";

// *middleware config
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());

app.use(cors(corsOption));
// *routes
// authenticate the user to access weather
app.use("/auth", authRoute);

app.use("/layout", verifyAccessToken, layoutRoute);
app.post("/weatherAi", verifyAccessToken, async (req, res) => {
  const { weatherData, question } = req.body;
  if (
    !weatherData ||
    !question ||
    question.length > 100 ||
    question.length === 0
  ) {
    const error: CustomError = new Error("invalid data and question");
    error.status = 400; // Bad Request
    throw error;
  }

  const promptRes = await geminiPrompt(question, weatherData);

  res.json({ answer: promptRes });
  return;
});

app.use(errorHandler);

app.listen(3000, () => console.log("Server ready on port d3000."));

export default app;
