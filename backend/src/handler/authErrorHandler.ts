import express, { NextFunction, Request, Response } from "express";
import { CustomError } from "../types/type";

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    msg: err.message || "Internal Server Error",
  });
};
