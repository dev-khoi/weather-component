import express from "express";
import { generateAccessToken, generateRefreshToken, } from "../auth/authentication.js";
// SECRET KEY
import { passport } from "../auth/passportConfig.js";
import dotenv from "dotenv";
dotenv.config();
const frontend = process.env.FRONTEND_URL;
// database
<<<<<<< HEAD
<<<<<<< HEAD
const index_js_1 = require("../../generated/prisma/index.js");
const authErrorHandler_js_1 = require("./authErrorHandler.js");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const prisma = new index_js_1.PrismaClient();
const googleAuthRoute = express_1.default.Router();
exports.googleAuthRoute = googleAuthRoute;
googleAuthRoute.use(passportConfig_js_1.passport.initialize());
=======
=======
>>>>>>> 94f14efb092748d6a22654a2beb9d9eeae76ce80
import { PrismaClient } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";
const prisma = new PrismaClient();
const googleAuthRoute = express.Router();
<<<<<<< HEAD
>>>>>>> b387e29 (fix test file and config)
=======
>>>>>>> 94f14efb092748d6a22654a2beb9d9eeae76ce80
// refreshToken search
googleAuthRoute.get("/register", // becomes /auth/google/register
passport.authenticate("google", {
    scope: ["email", "profile"],
    session: false,
}));
// Step 2: Handle callback from Google
googleAuthRoute.get("/callback", // becomes /auth/google/callback
passport.authenticate("google", {
    session: false,
    failureRedirect: `${frontend}/login`,
}), expressAsyncHandler(async (req, res) => {
    const user = req.user;
    if (!user || !user.userId || !user.email) {
        const error = new Error("Missing authentication");
        error.status = 400; // Bad Request
        throw error;
    }
    const userCheck = await prisma.user.findFirst({
        where: {
            email: user.email,
        },
    });
    if (!userCheck || !userCheck.userId) {
        const error = new Error("Google authentication failed");
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
}));
<<<<<<< HEAD
<<<<<<< HEAD
googleAuthRoute.use(authErrorHandler_js_1.errorHandler);
=======
export { googleAuthRoute };
>>>>>>> b387e29 (fix test file and config)
=======
export { googleAuthRoute };
>>>>>>> 94f14efb092748d6a22654a2beb9d9eeae76ce80
