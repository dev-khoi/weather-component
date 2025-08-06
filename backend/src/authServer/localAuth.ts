import express, { NextFunction, Request, Response } from "express";

import { Router } from "express";
import { genPassword, verifyPassword } from "../lib/passwordUtils.js";
import { registerValidator } from "../validator/validation.js";
// import { pool } from "./db/pool.js";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../auth/authentication.js";

// SECRET KEY
import { createNewUserLayout } from "../db/defaultLayout.js";

import { passport } from "../auth/passportConfig.js";

import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";
// database
import { PrismaClient } from "@prisma/client";
import { CustomError } from "../types/type.js";
import expressAsyncHandler from "express-async-handler";
const prisma = new PrismaClient();
// refreshToken search

// *middleware config
const localAuthRoute = Router();
// cors for connecting to frontend (vite)
// const PgSession = connectPgSimple(session);


localAuthRoute.post(
  "/register",
  registerValidator,
  expressAsyncHandler(async (req: Request, res: Response) => {
    const { username, email, password } = req.body;
    const saltHash = genPassword(password);
    const salt = saltHash.salt;
    const hash = saltHash.hash;

    const existingCheck = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (existingCheck) {
      const error: CustomError = new Error("User already exists");
      error.status = 409;
      throw error;
    }
    const user = await prisma.user.create({
      data: {
        email,
        ...(username && { username }),
        salt,
        hash,
      },
    });

    if (user) {
      await createNewUserLayout(user.userId);
    }

    res.status(200).json({ msg: "user created successfully" });
    return;
  })
);

// creating tokens for user when logging in
// user send email
// -> generate access and refresh token
// -> storing the history of the refresh token
localAuthRoute.post(
  "/login",
  expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          userId: true,
          hash: true,
          salt: true,
        },
      });

      if (!user || !user.hash || !user.salt) {
        const error: CustomError = new Error("Invalid email or password");
        error.status = 401;
        throw error;
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
            expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          },
        });

        // change secure to true
        res
          .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",

            maxAge: 15 * 60 * 1000,
          })
          .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",

            maxAge: 15 * 24 * 60 * 60 * 1000,
          });
      } else {
        const error: CustomError = new Error("Invalid email or password");
        error.status = 401;
        throw error;
      }
      res.status(200).json({ message: "Login successful" }); // Or send other relevant non-sensitive user data
      return;
    }
  )
);

export { localAuthRoute };
