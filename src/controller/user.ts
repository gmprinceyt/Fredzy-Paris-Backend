import { Request, Response } from "express";
import { User } from "../model/user.js";
import { NewUserRequestBody } from "../types/types.js";
import { logger } from "../utils/logger.js";

export const newUser = async (
  req: Request<Record<string, never>, unknown, NewUserRequestBody>,
  res: Response
) => {
  try {
    const { _id, name, email, gender, dob, photo } = req.body;

    const NewUser = await User.create({
      _id,
      name,
      email,
      gender,
      dob: new Date(dob),
      photo,
    });

    console.log(NewUser.age);

    res.status(201).json({
      success: true,
      message: `User Created \n ,${NewUser}`,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      message: "internal server Error",
      error: error,
      success: false,
    });
  }
};
