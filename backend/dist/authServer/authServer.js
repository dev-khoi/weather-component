"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// import { pool } from "./db/pool.js";
const authentication_js_1 = require("../auth/authentication.js");
const passportConfig_js_1 = require("../auth/passportConfig.js");
// SECRET KEY
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const frontend = process.env.FRONTEND_URL;
const secretAccessToken = process.env.ACCESS_SECRET_TOKEN;
const secretRefreshToken = process.env.REFRESH_SECRET_TOKEN;
const cors_1 = __importDefault(require("cors"));
const corsOption = {
    origin: [frontend],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
};
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// database
const index_js_1 = require("../../generated/prisma/index.js");
const googleAuth_js_1 = require("./googleAuth.js");
const localAuth_js_1 = require("./localAuth.js");
const authErrorHandler_js_1 = require("./authErrorHandler.js");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const prisma = new index_js_1.PrismaClient();
// refreshToken search
// *middleware config
const authRoute = express_1.default.Router();
exports.authRoute = authRoute;
authRoute.use(passportConfig_js_1.passport.initialize());
// cors for connecting to frontend (vite)
authRoute.use((0, cors_1.default)(corsOption));
// const PgSession = connectPgSimple(session);
authRoute.use(express_1.default.json());
authRoute.use(express_1.default.urlencoded({ extended: true }));
authRoute.use((0, cookie_parser_1.default)());
// jwt and google signing up and logging in
// all create access and refresh token
authRoute.use("/local", localAuth_js_1.localAuthRoute);
authRoute.use("/google", googleAuth_js_1.googleAuthRoute);
// creating new token for user by verifying the refresh token
// authenticate the refresh token
// user sends the refresh token
// if refreshToken is validated
// ->access token
authRoute.post("/verifyingToken", (0, express_async_handler_1.default)(async (req, res) => {
    // extracting the token
    const refreshToken = req.cookies.refreshToken;
    const accessToken = req.cookies.accessToken;
    if (accessToken == null && refreshToken == null) {
        res.sendStatus(401);
        return;
    }
    // verifying access token
    jsonwebtoken_1.default.verify(accessToken, secretAccessToken, async (err, jwt_payload) => {
        // failed to veify access token
        // -> verifying refresh token
        if (err) {
            return jsonwebtoken_1.default.verify(refreshToken, secretRefreshToken, (err, jwt_payload) => {
                // failed to verify refresh token
                if (err ||
                    !jwt_payload ||
                    typeof jwt_payload !== "object" ||
                    !jwt_payload.userId) {
                    const error = new Error("Invalid or expired token");
                    error.status = 403; // Bad Request
                    throw error;
                }
                // refreshToken successfully verified
                // generate new accessToken);
                const accessToken = (0, authentication_js_1.generateAccessToken)(jwt_payload.userId);
                return res
                    .cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "strict",
                    maxAge: 15 * 60 * 1000, // 15 min
                })
                    .status(200)
                    .json({ valid: true });
            });
        }
        return res.status(200).json({ valid: true });
    });
}));
// deleting user tokens when logging out
authRoute.delete("/logout", (0, express_async_handler_1.default)(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        const error = new Error("No refresh token provided");
        error.status = 400; // Bad Request
        throw error;
    }
    await prisma.refreshToken.delete({
        where: {
            token: refreshToken,
        },
    });
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/",
    });
    res.status(200).send({ message: "login success" });
}));
authRoute.use(authErrorHandler_js_1.errorHandler);
