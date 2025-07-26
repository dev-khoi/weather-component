import express, { Request, Response } from "express";
import { NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

const secretAccessToken = process.env.ACCESS_SECRET_TOKEN!;
const secretRefreshToken = process.env.REFRESH_SECRET_TOKEN!;
// authenticate the token
const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header("authorization");

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "No token provided" });
    return;
  }
  jwt.verify(token, secretAccessToken, (err, jwt_payload) => {
    if (err) {
      res.status(403).json({ error: "Invalid or expired token" });
      return;
    }

    req.user = jwt_payload;
    next();
  });
};

// generate the access token for user
// ideally expires at least 10 minutes
const generateAccessToken = (userId: number | string) => {
  const idStr = typeof userId === "number" ? userId.toString() : `${userId}`;

  return jwt.sign({ userId: idStr }, secretAccessToken, {
    expiresIn: "300s",
  });
};

const generateRefreshToken = (userId: number | string) => {
  const idStr = typeof userId === "number" ? userId.toString() : `${userId}`;

  return jwt.sign({ userId: idStr }, secretRefreshToken, {
    expiresIn: "15d",
  });
};
export { authenticateToken, generateAccessToken, generateRefreshToken };
