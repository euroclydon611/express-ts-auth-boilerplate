require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import ErrorHandlerMiddleware from "./middleware/error";
import ErrorHandler from "./utils/ErrorHandler";

//body parser
app.use(express.json({ limit: "50mb" }));

//cookie parser
app.use(cookieParser());

//cors => cross origin resource sharing
app.use(cors({ origin: process.env.ORIGIN }));

//routers
import userRoutes from "./routes/user.routes";

//testing api
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ success: true, message: "api is working" });
});

//routes
app.use("/api/v1", userRoutes);

//unknown routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new ErrorHandler(`Route ${req.originalUrl} not found`, 400);
  next(err);
});

app.use(ErrorHandlerMiddleware);
