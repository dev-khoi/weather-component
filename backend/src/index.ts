import express from "express";

import { authenticateToken } from "./auth/authentication.js";
// SECRET KEY
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
const corsOption = {
  origin: ["http://localhost:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

// !not ideal, store in a db
let refreshTokenArr = [];

// *middleware config
const app = express();
// cors for connecting to vite
app.use(cors(corsOption));
// const PgSession = connectPgSimple(session);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// *routes
// authenticate the user to access weather

app.get("/", authenticateToken, (req, res) => {
  res.json({ email: req.body.email });
});

app.listen(3000, () => {
  console.log("server on port 3000 started");
});
