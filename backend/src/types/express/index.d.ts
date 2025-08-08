import express from "express";

interface Decoded {
  userId: string;
}
declare global {
  namespace Express {
    interface Request {
      decoded?: Decoded;
    }
  }
}

export { Decoded };
