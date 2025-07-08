import express from "express";
import { genPassword, verifyPassword } from "./lib/passwordUtils.js";
import { registerValidator } from "../../../learningAuth/backend/validator/validation.js";
// import { pool } from "./db/pool.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "./auth/authentication.js";
import jwt from "jsonwebtoken";
// SECRET KEY
import { createDefaultWeatherLayout } from "./db/defaultLayout.js";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";
const corsOption = {
  origin: ["http://localhost:5173"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};
import cookieParser from "cookie-parser";
// database
import { PrismaClient } from "./generated/prisma/index.js";
const prisma = new PrismaClient();
// refreshToken search

// *middleware config
const app = express();
// cors for connecting to vite
app.use(cors(corsOption));
// const PgSession = connectPgSimple(session);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// register
app.post("/register", registerValidator, async (req, res) => {
  const { username, email, password } = req.body;
  const saltHash = genPassword(password);
  const salt = saltHash.salt;
  const hash = saltHash.hash;

  try {
    const user = await prisma.user.create({
      data: {
        email,
        ...(username && { username }),
        salt,
        hash,
      },
    });

    console.log(Object.keys(prisma));
    await prisma.weatherLayout.create({
      data: { userId: user.userId, ...createDefaultWeatherLayout },
    });
  } catch (e) {
    console.error(e);
  }
  res.redirect("http://localhost:5173/login");
});

// creating new token for user by verifying the refresh token
// authenticate the refresh token
// user sends the refresh token
// if refreshToken is validated
// ->access token
app.post("/verifyingToken", async (req, res) => {
  // extracting the token
  const refreshToken = req.cookies.refreshToken;
  const accessToken = req.cookies.accessToken;
  if (accessToken == null && refreshToken == null) {
    res.sendStatus(401);
    return;
  }

  // verifying access token
  jwt.verify(
    accessToken,
    process.env.ACCESS_SECRET_TOKEN,
    async (err, decoded) => {
      // failed to veify access token
      // -> verifying refresh token
      if (err) {
        return jwt.verify(
          refreshToken,
          process.env.REFRESH_SECRET_TOKEN,
          (err, decoded) => {
            // failed to verify refresh token
            if (err) {
              return res
                .status(403)
                .json({ error: "Invalid or expired token" });
            }
            // refreshToken successfully verified
            // generate new accessToken);
            const accessToken = generateAccessToken(decoded.userId);
            return res
              .cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 5 * 60 * 1000, // 15 min
              })
              .status(200)
              .json({ valid: true });
          }
        );
      }
      return res.status(200).json({ valid: true });
    }
  );
});

// creating tokens for user when logging in
// user send email
// -> generate access and refresh token
// -> storing the history of the refresh token
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        userId: true,
        hash: true,
        salt: true
      }
    });

    if (!user) {
      res.status(401).json({ error: "Invalid email or password" });
      return;
    }

    const { userId, hash, salt } = user;

    if (verifyPassword(password, hash, salt)) {
      // ?missing password checking step
      const accessToken = generateAccessToken(userId);
      const refreshToken = generateRefreshToken(userId);
      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: userId,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days expiry
        },
      });

      // change secure to true
      res
        .cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          maxAge: 5 * 60 * 1000, // 15 min
        })
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          maxAge: 15 * 24 * 60 * 60 * 1000, // 7 days
        })
        .redirect("http://localhost:5173/weather");
    } else {
      res.status(401).json({ error: "Invalid email or password" });
    }
  } catch (e) {
    console.error("login error", e);
    res.status(500).json({ error: "Internal server error" });
  }
});

// deleting user tokens when logging out
app.delete("/logout", async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  try {
    await prisma.refreshToken.delete({
      where: {
        token: refreshToken,
      },
    });
    console.log("logout success");
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(204).json({ message: "logout successfully" });
  } catch (e) {
    console.error("logout error", e);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(4000, () => {
  console.log("jwt authentication");
});
