import { Request } from "express";
import { TryCatch } from "../middleware/error.js";
import { CreateNewOrder } from "../types/types.js";
import { Order } from "../model/order.js";
import { ApiResponse, ErrorHandler } from "../utils/utills-class.js";
import { ReduceStock, RevailidateCache } from "../utils/feature.js";
import { cache } from "../app.js";

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
    ) {
      return next(new ErrorHandler("All Fields are required", 400));
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
    await RevailidateCache({ product: true, order: true, admin: true });

    res.status(201).json(new ApiResponse(201, "Order Placed Successfully"));
  }
);

export const getAllUsersOrders = TryCatch(async (req, res, next) => {
  const { id: user } = req.query;

  console.log(user)
  if (!user) {
    return next(new ErrorHandler("Enter User Id", 400));
  }
  let orders = [];
  const key = `orders-${user}`

  if (cache.has(key)) {
    orders = JSON.parse(cache.get(key) as string);
  } else {
    orders = await Order.find({user});
    if (!orders) return next(new ErrorHandler("orders Not Found", 404));
    cache.set(key, JSON.stringify(orders));
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, "Users All Orders Fatched successfully", orders)
    );
});

export const getAllOrder = TryCatch(async (req, res) => {
  let order = {};

  if (cache.has("all-order")) {
    order = JSON.parse(cache.get("all-order") as string);
  } else {
    order = await Order.find();
    cache.set("all-order", JSON.stringify(order));
  }

  res.status(200).json(new ApiResponse(200, "Success Fatched Data", order));
});
