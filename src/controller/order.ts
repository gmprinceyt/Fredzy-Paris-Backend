import { Request } from "express";
import { TryCatch } from "../middleware/error.js";
import { CreateNewOrder } from "../types/types.js";
import { Order } from "../model/order.js";
import { ApiResponse, ErrorHandler } from "../utils/utills-class.js";
import { ReduceStock, RevailidateCache } from "../utils/feature.js";


export const newOrder = TryCatch(
  async (
    req: Request<Record<string, unknown>, unknown, CreateNewOrder>,
    res,
    next
  ) => {
    const {
      orderItems,
      discount,
      shippingCharges,
      shippingInfo,
      subtotal,
      tax,
      total,
      user,
    } = req.body;

    if (
      !orderItems ||
      !shippingCharges ||
      !shippingInfo ||
      !subtotal ||
      !tax ||
      !total ||
      !user
    ){
      return next(new ErrorHandler("All Fields are required", 400) )
    }
    await Order.create({
        orderItems,
        discount,
        shippingCharges,
        shippingInfo,
        subtotal,
        tax,
        total,
        user,
      });

      //Reduce Stock 
    ReduceStock(orderItems);
    await RevailidateCache({ product: true });

    res
      .status(201)
      .json(new ApiResponse(201, "Order Create Successfully",));
  }
);
