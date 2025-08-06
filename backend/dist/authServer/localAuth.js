<<<<<<< HEAD
<<<<<<< HEAD
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.localAuthRoute = void 0;
const express_1 = __importDefault(require("express"));
const express_2 = require("express");
const passwordUtils_js_1 = require("../lib/passwordUtils.js");
const validation_js_1 = require("../validator/validation.js");
=======
import { Router } from "express";
import { genPassword, verifyPassword } from "../lib/passwordUtils.js";
import { registerValidator } from "../validator/validation.js";
>>>>>>> b387e29 (fix test file and config)
=======
import { Router } from "express";
import { genPassword, verifyPassword } from "../lib/passwordUtils.js";
import { registerValidator } from "../validator/validation.js";
>>>>>>> 94f14efb092748d6a22654a2beb9d9eeae76ce80
// import { pool } from "./db/pool.js";
import { generateAccessToken, generateRefreshToken, } from "../auth/authentication.js";
// SECRET KEY
<<<<<<< HEAD
<<<<<<< HEAD
const defaultLayout_js_1 = require("../db/defaultLayout.js");
const passportConfig_js_1 = require("../auth/passportConfig.js");
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const frontend = process.env.FRONTEND;
const corsOption = {
    origin: [frontend],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
};
const cookie_parser_1 = __importDefault(require("cookie-parser"));
=======
import { createNewUserLayout } from "../db/defaultLayout.js";
import dotenv from "dotenv";
dotenv.config();
>>>>>>> 94f14efb092748d6a22654a2beb9d9eeae76ce80
// database
import { PrismaClient } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";
const prisma = new PrismaClient();
// refreshToken search
// *middleware config
const localAuthRoute = Router();
// cors for connecting to frontend (vite)
// const PgSession = connectPgSimple(session);
<<<<<<< HEAD
localAuthRoute.use(express_1.default.json());
localAuthRoute.use(express_1.default.urlencoded({ extended: true }));
localAuthRoute.use((0, cookie_parser_1.default)());
const secretAccessToken = process.env.ACCESS_SECRET_TOKEN;
const secretRefreshToken = process.env.REFRESH_SECRET_TOKEN;
localAuthRoute.post("/register", validation_js_1.registerValidator, (0, express_async_handler_1.default)(async (req, res) => {
=======
import { createNewUserLayout } from "../db/defaultLayout.js";
import dotenv from "dotenv";
dotenv.config();
// database
import { PrismaClient } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";
const prisma = new PrismaClient();
// refreshToken search
// *middleware config
const localAuthRoute = Router();
// cors for connecting to frontend (vite)
// const PgSession = connectPgSimple(session);
localAuthRoute.post("/register", registerValidator, expressAsyncHandler(async (req, res) => {
>>>>>>> b387e29 (fix test file and config)
=======
localAuthRoute.post("/register", registerValidator, expressAsyncHandler(async (req, res) => {
>>>>>>> 94f14efb092748d6a22654a2beb9d9eeae76ce80
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
        const error = new Error("User already exists");
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
}));
// creating tokens for user when logging in
// user send email
// -> generate access and refresh token
// -> storing the history of the refresh token
localAuthRoute.post("/login", expressAsyncHandler(async (req, res, next) => {
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
        const error = new Error("Invalid email or password");
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
    }
    else {
        const error = new Error("Invalid email or password");
        error.status = 401;
        throw error;
    }
    res.status(200).json({ message: "Login successful" }); // Or send other relevant non-sensitive user data
    return;
}));
<<<<<<< HEAD
<<<<<<< HEAD
localAuthRoute.use(authErrorHandler_js_1.errorHandler);
=======
export { localAuthRoute };
>>>>>>> b387e29 (fix test file and config)
=======
export { localAuthRoute };
>>>>>>> 94f14efb092748d6a22654a2beb9d9eeae76ce80
