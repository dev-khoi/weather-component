import express, { Request, Response } from "express";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../auth/authentication.js";
import cors from "cors";
// SECRET KEY
import { passport } from "../auth/passportConfig.js";
import dotenv from "dotenv";
dotenv.config();
const frontend = process.env.FRONTEND_URL!;



// database
import { PrismaClient, User } from "@prisma/client";
import { errorHandler } from "./authErrorHandler.js";
import { CustomError } from "../types/type.js";
import expressAsyncHandler from "express-async-handler";
const prisma = new PrismaClient();

const googleAuthRoute = express.Router();
googleAuthRoute.use(cors(corsOption));
googleAuthRoute.use(passport.initialize());
// refreshToken search
googleAuthRoute.get(
  "/register", // becomes /auth/google/register
  passport.authenticate("google", {
    scope: ["email", "profile"],
    session: false,
  })
);

// Step 2: Handle callback from Google
googleAuthRoute.get(
  "/callback", // becomes /auth/google/callback
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${frontend}/login`,
  }),
  expressAsyncHandler(async (req: Request, res: Response) => {
    const user = req.user as User;

    if (!user || !user.userId || !user.email) {
      const error: CustomError = new Error("Missing authentication");
      error.status = 400; // Bad Request
      throw error;
    }
    const userCheck = await prisma.user.findFirst({
      where: {
        email: user.email,
      },
    });

    if (!userCheck || !userCheck.userId) {
      const error: CustomError = new Error("Google authentication failed");
      error.status = 401; // Bad Request
      throw error;
    }

    const accessToken = generateAccessToken(user.userId);
    const refreshToken = generateRefreshToken(user.userId);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.userId,
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      },
    });

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
      })
      .redirect(`${frontend}/weather`);
    return;
  })
);
googleAuthRoute.use(errorHandler);

export { googleAuthRoute };
