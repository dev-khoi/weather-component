"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = void 0;
exports.genPassword = genPassword;
exports.verifyPassword = verifyPassword;
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function genPassword(password) {
    const salt = crypto_1.default.randomBytes(32).toString("hex");
    const hash = crypto_1.default
        .pbkdf2Sync(password, salt, 10000, 32, "sha512")
        .toString("hex"); // 32 bytes
    return { salt, hash };
}
function verifyPassword(password, hash, salt) {
    const hashVerify = crypto_1.default
        .pbkdf2Sync(password, salt, 10000, 32, "sha512")
        .toString("hex"); // 32 bytes
    return hash === hashVerify;
}
// return payload in req
const verifyAccessToken = (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    if (accessToken == null) {
        res.sendStatus(401);
        return;
    }
    jsonwebtoken_1.default.verify(accessToken, process.env.ACCESS_SECRET_TOKEN, async (err, decoded) => {
        if (err || !decoded || typeof decoded === "string") {
            return res.status(401).json({ message: "unauthorized" });
        }
        req.decoded = decoded;
    });
    next();
};
exports.verifyAccessToken = verifyAccessToken;
