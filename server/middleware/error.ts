import { NextFunction, Request, Response } from "express";
import ErrorHandler from "../utils/ErrorHandler";
import { StatusCodes } from "http-status-codes";

const ErrorHandlerMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  err.message = err.message || "Internal server error";

  // Log the error for later analysis
  console.error(err);

  // Wrong MongoDB ID error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid ${err.path}`;
    err = new ErrorHandler(message, StatusCodes.BAD_REQUEST);
  }

  // Duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate entry for ${Object.keys(err.keyValue)}`;
    err = new ErrorHandler(message, StatusCodes.BAD_REQUEST);
  }

  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid JSON web token. Please try again.";
    err = new ErrorHandler(message, StatusCodes.UNAUTHORIZED);
  }

  // JWT expired error
  if (err.name === "TokenExpiredError") {
    const message = "JSON web token has expired. Please log in again.";
    err = new ErrorHandler(message, StatusCodes.UNAUTHORIZED);
  }

  // Send a more user-friendly message to clients
  res.status(err.statusCode).json({
    success: false,
    status: err.statusCode,
    message: err.message,
  });
};

export default ErrorHandlerMiddleware;
