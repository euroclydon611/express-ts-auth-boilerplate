import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { redis } from "../database/redis";

//get user by id
export const getUserById = async (id: string, res: Response) => {
  const userJson = await redis.get(id);
  if (userJson) {
    const user = JSON.parse(userJson);
    res.status(StatusCodes.OK).json({ success: true, user });
  }
};
