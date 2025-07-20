"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = exports.authenticateToken = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secretAccessToken = process.env.ACCESS_SECRET_TOKEN;
const secretRefreshToken = process.env.REFRESH_SECRET_TOKEN;
// authenticate the token
const authenticateToken = (req, res, next) => {
    const authHeader = req.header("authorization");
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
        res.status(401).json({ error: "No token provided" });
        return;
    }
    jsonwebtoken_1.default.verify(token, secretAccessToken, (err, jwt_payload) => {
        if (err) {
            res.status(403).json({ error: "Invalid or expired token" });
            return;
        }
        req.user = jwt_payload;
        console.log(req.user);
        next();
    });
};
exports.authenticateToken = authenticateToken;
// generate the access token for user
// ideally expires at least 10 minutes
const generateAccessToken = (userId) => {
    console.log(userId);
    const idStr = typeof userId === "number" ? userId.toString() : `${userId}`;
    return jsonwebtoken_1.default.sign({ userId: idStr }, secretAccessToken, {
        expiresIn: "300s",
    });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = (userId) => {
    const idStr = typeof userId === "number" ? userId.toString() : `${userId}`;
    return jsonwebtoken_1.default.sign({ userId: idStr }, secretRefreshToken, {
        expiresIn: "15d",
    });
};
exports.generateRefreshToken = generateRefreshToken;
