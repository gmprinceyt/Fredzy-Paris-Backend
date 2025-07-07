import { NextFunction, Request, Response } from "express";

export interface NewUserRequestBody {
  name: string;
  email: string;
  _id: string;
  dob: Date;
  photo: string;
  gender: string;
}

export type controller<
  Params = Record<string, unknown>,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = Record<string, unknown>
> = (
  req:  Request<Params, ResBody, ReqBody, ReqQuery>,
  res: Response,
  next: NextFunction
) => Promise<void>;
