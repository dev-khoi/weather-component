"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuthRoute = void 0;
const express_1 = __importDefault(require("express"));
const authentication_js_1 = require("../auth/authentication.js");
// SECRET KEY
const passportConfig_js_1 = require("../auth/passportConfig.js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const frontend = process.env.FRONTEND_URL;
// database
<<<<<<< HEAD
const index_js_1 = require("../../generated/prisma/index.js");
const authErrorHandler_js_1 = require("./authErrorHandler.js");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const prisma = new index_js_1.PrismaClient();
const googleAuthRoute = express_1.default.Router();
exports.googleAuthRoute = googleAuthRoute;
googleAuthRoute.use(passportConfig_js_1.passport.initialize());
=======
import { PrismaClient } from "@prisma/client";
import expressAsyncHandler from "express-async-handler";
const prisma = new PrismaClient();
const googleAuthRoute = express.Router();
>>>>>>> b387e29 (fix test file and config)
// refreshToken search
googleAuthRoute.get("/register", // becomes /auth/google/register
passportConfig_js_1.passport.authenticate("google", {
    scope: ["email", "profile"],
    session: false,
}));
// Step 2: Handle callback from Google
googleAuthRoute.get("/callback", // becomes /auth/google/callback
passportConfig_js_1.passport.authenticate("google", {
    session: false,
    failureRedirect: `${frontend}/login`,
}), (0, express_async_handler_1.default)(async (req, res) => {
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
    const accessToken = (0, authentication_js_1.generateAccessToken)(user.userId);
    const refreshToken = (0, authentication_js_1.generateRefreshToken)(user.userId);
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
googleAuthRoute.use(authErrorHandler_js_1.errorHandler);
=======
export { googleAuthRoute };
>>>>>>> b387e29 (fix test file and config)
