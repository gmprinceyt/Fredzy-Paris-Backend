import { NextFunction, Request, Response } from "express";

export interface NewUserRequestBody {
  name: string;
  email: string;
  _id: string;
  dob: Date;
  photo: string;
  gender: string;
}

export interface CreateProductRequestBody {
  name: string;
  category: string;
  price: number;
  stock: number;
  discription: string;
  photo: string;
}

// For Custom async Handler
export type controller<
  Params = Record<string, unknown>,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = Record<string, unknown>
> = (
  req:  Request<Params, ResBody, ReqBody, ReqQuery>,
  res: Response,
  next: NextFunction
) => Promise<void | Response<unknown , Record<string ,unknown>>>;

export type SearchRequestQuery  = {
  search?:string;
  category?:string;
  price?:string;
  sort?:string;
  page?:string;
}
