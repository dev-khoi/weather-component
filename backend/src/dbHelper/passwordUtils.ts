import type { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { CustomError, MyJwtPayload } from "../types/type";

function genPassword(password: string) {
  const salt = crypto.randomBytes(32).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 32, "sha512")
    .toString("hex"); // 32 bytes
  return { salt, hash };
}

function verifyPassword(password: string, hash: string, salt: string) {
  const hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 32, "sha512")
    .toString("hex"); // 32 bytes
  return hash === hashVerify;
}

// return payload in req
const verifyAccessToken = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.accessToken;
  if (accessToken == null) {
    const error: CustomError = new Error("No access token provided");
    error.status = 401; // Bad Request
    throw error;
  }

  jwt.verify(
    accessToken,
    process.env.ACCESS_SECRET_TOKEN!,
    async (
      err: VerifyErrors | null,
      decoded: MyJwtPayload | string | undefined
    ) => {
      if (err || !decoded || typeof decoded === "string") {
        const error: CustomError = new Error("Access token is invalid");
        error.status = 401; // Bad Request
        throw error;
      }

      req.decoded = decoded;
    }
  );
  next();
};
export { genPassword, verifyPassword, verifyAccessToken };
