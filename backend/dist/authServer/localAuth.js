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
// import { pool } from "./db/pool.js";
const authentication_js_1 = require("../auth/authentication.js");
// SECRET KEY
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
// database
const index_js_1 = require("../../generated/prisma/index.js");
const authErrorHandler_js_1 = require("./authErrorHandler.js");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const prisma = new index_js_1.PrismaClient();
// refreshToken search
// *middleware config
const localAuthRoute = (0, express_2.Router)();
exports.localAuthRoute = localAuthRoute;
localAuthRoute.use(passportConfig_js_1.passport.initialize());
// cors for connecting to frontend (vite)
localAuthRoute.use((0, cors_1.default)(corsOption));
// const PgSession = connectPgSimple(session);
localAuthRoute.use(express_1.default.json());
localAuthRoute.use(express_1.default.urlencoded({ extended: true }));
localAuthRoute.use((0, cookie_parser_1.default)());
const secretAccessToken = process.env.ACCESS_SECRET_TOKEN;
const secretRefreshToken = process.env.REFRESH_SECRET_TOKEN;
localAuthRoute.post("/register", validation_js_1.registerValidator, (0, express_async_handler_1.default)(async (req, res) => {
    const { username, email, password } = req.body;
    const saltHash = (0, passwordUtils_js_1.genPassword)(password);
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
        await (0, defaultLayout_js_1.createNewUserLayout)(user.userId);
    }
    res.status(200).json({ msg: "user created successfully" });
    return;
}));
// creating tokens for user when logging in
// user send email
// -> generate access and refresh token
// -> storing the history of the refresh token
localAuthRoute.post("/login", (0, express_async_handler_1.default)(async (req, res, next) => {
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
    if ((0, passwordUtils_js_1.verifyPassword)(password, hash, salt)) {
        // ?missing password checking step
        const accessToken = (0, authentication_js_1.generateAccessToken)(userId);
        const refreshToken = (0, authentication_js_1.generateRefreshToken)(userId);
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
            secure: false,
            sameSite: "strict",
            maxAge: 15 * 60 * 1000,
        })
            .cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
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
localAuthRoute.use(authErrorHandler_js_1.errorHandler);
