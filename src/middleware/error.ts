import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../utils/utills-class.js";
import { controller } from "../types/types.js";

// Error Handler 
export const ErrorMiddleware = (
  err: ErrorHandler,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  const message = err.message || "Internal Server Error";
  const statuscode = err.statuscode || 500;

  if (err.name === "CastError"){
     res.status(statuscode).json({
      message: "invaild id Or something else",
      success: false
    })
    return;
  }
  res.status(statuscode).json({
    message,
    success: false,
    err,
  });
};


// Async Handler 
export const TryCatch = <
  Params = Record<string, unknown>,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = Record<string, unknown>
>(
  fn: controller<Params, ResBody, ReqBody, ReqQuery>
) => {
  return async function (req: Request<Params, ResBody, ReqBody, ReqQuery>, res: Response, next: NextFunction) {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
