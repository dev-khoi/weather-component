import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
function genPassword(password) {
    const salt = crypto.randomBytes(32).toString("hex");
    const hash = crypto
        .pbkdf2Sync(password, salt, 10000, 32, "sha512")
        .toString("hex"); // 32 bytes
    return { salt, hash };
}
function verifyPassword(password, hash, salt) {
    const hashVerify = crypto
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
    jwt.verify(accessToken, process.env.ACCESS_SECRET_TOKEN, async (err, decoded) => {
        if (err || !decoded || typeof decoded === "string") {
            return res.status(401).json({ message: "unauthorized" });
        }
        req.decoded = decoded;
    });
    next();
};
export { genPassword, verifyPassword, verifyAccessToken };
