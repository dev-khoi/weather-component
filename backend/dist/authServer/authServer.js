import express from "express";
import jwt from "jsonwebtoken";
// import { pool } from "./db/pool.js";
import { generateAccessToken, } from "../auth/authentication.js";
import { passport } from "../auth/passportConfig.js";
// SECRET KEY
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
import dotenv from "dotenv";
dotenv.config();
const secretAccessToken = process.env.ACCESS_SECRET_TOKEN;
const secretRefreshToken = process.env.REFRESH_SECRET_TOKEN;
>>>>>>> b387e29 (fix test file and config)
=======
import dotenv from "dotenv";
dotenv.config();
const secretAccessToken = process.env.ACCESS_SECRET_TOKEN;
const secretRefreshToken = process.env.REFRESH_SECRET_TOKEN;
>>>>>>> 94f14efb092748d6a22654a2beb9d9eeae76ce80
// database
import { PrismaClient } from "@prisma/client";
import { googleAuthRoute } from "./googleAuth.js";
import { localAuthRoute } from "./localAuth.js";
import { errorHandler } from "./authErrorHandler.js";
import expressAsyncHandler from "express-async-handler";
const prisma = new PrismaClient();
// refreshToken search
// *middleware config
const authRoute = express.Router();
authRoute.use(passport.initialize());
// cors for connecting to frontend (vite)
<<<<<<< HEAD
<<<<<<< HEAD
authRoute.use((0, cors_1.default)(corsOption));
// const PgSession = connectPgSimple(session);
authRoute.use(express_1.default.json());
authRoute.use(express_1.default.urlencoded({ extended: true }));
authRoute.use((0, cookie_parser_1.default)());
=======
// const PgSession = connectPgSimple(session);
>>>>>>> b387e29 (fix test file and config)
=======
// const PgSession = connectPgSimple(session);
>>>>>>> 94f14efb092748d6a22654a2beb9d9eeae76ce80
// jwt and google signing up and logging in
// all create access and refresh token
authRoute.use("/local", localAuthRoute);
authRoute.use("/google", googleAuthRoute);
// creating new token for user by verifying the refresh token
// authenticate the refresh token
// user sends the refresh token
// if refreshToken is validated
// ->access token
authRoute.post("/verifyingToken", expressAsyncHandler(async (req, res) => {
    // extracting the token
    const refreshToken = req.cookies.refreshToken;
    const accessToken = req.cookies.accessToken;
    if (accessToken == null && refreshToken == null) {
        res.sendStatus(401);
        return;
    }
    // verifying access token
    jwt.verify(accessToken, secretAccessToken, async (err, jwt_payload) => {
        // failed to veify access token
        // -> verifying refresh token
        if (err) {
            return jwt.verify(refreshToken, secretRefreshToken, (err, jwt_payload) => {
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
                const accessToken = generateAccessToken(jwt_payload.userId);
                return res
                    .cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
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
authRoute.delete("/logout", expressAsyncHandler(async (req, res) => {
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
        sameSite: "none",
        path: "/",
    });
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
    });
    res.status(200).send({ message: "login success" });
}));
authRoute.use(errorHandler);
export { authRoute };
