import { Request } from "express";
import { TryCatch } from "../middleware/error.js";
import { CreateNewOrder } from "../types/types.js";
import { Order } from "../model/order.js";
import { ApiResponse, ErrorHandler } from "../utils/utills-class.js";
import { ReduceStock, RevailidateCache } from "../utils/feature.js";
import { cache } from "../app.js";


export const getAllUsersOrders = TryCatch(async (req, res, next) => {
  const { id: user } = req.query;

  if (!user) {
    return next(new ErrorHandler("Enter User Id", 400));
  }
  let orders = [];
  const key = `orders-${user}`;

  if (cache.has(key)) {
    orders = JSON.parse(cache.get(key) as string);
  } else {
    orders = await Order.find({ user });
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
  let order = [];
  const key = "all-order";
  if (cache.has(key)) {
    order = JSON.parse(cache.get(key) as string);
  } else {
    order = await Order.find().populate("user", "name");
    cache.set(key, JSON.stringify(order));
  }

  res.status(200).json(new ApiResponse(200, "Success Fatched Data", order));
});

export const getSingleOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new ErrorHandler("Enter Order Id", 400));
  }

  let order;
  const key = `single-${id}`;

  if (cache.has(key)) {
    order = JSON.parse(cache.get(key) as string);
  } else {
    order = await Order.findById(id).populate("user", "name");
    if (!order) return next(new ErrorHandler("Order not Found", 404));
    cache.set(key, JSON.stringify(order));
  }

  res.status(200).json(new ApiResponse(200, "Success Fatched Data", order));
});


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
    const order = await Order.create({
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
    RevailidateCache({
      product: true,
      order: true,
      admin: true,
      orderid: String(order._id),
      userId: user,
      productId: String(order.orderItems.map(i => i._id))
    });

    res.status(201).json(new ApiResponse(201, "Order Placed Successfully"));
  }
);

export const updateOrderStatus = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new ErrorHandler("Enter Order Id", 400));
  }

  const order = await Order.findById(id);
  if (!order) return next(new ErrorHandler("Order Not Found", 404));

  switch (order.status) {
    case "Processing":
      order.status = "Shipped";
      break;
    case "Shipped":
      order.status = "Delivered";
      break;

    default:
      order.status = "Delivered";
      break;
  }

  await order.save();
  RevailidateCache({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderid: String(order._id),
  });

  res
    .status(200)
    .json(new ApiResponse(200, "Order Status Updated  Successfully✅"));
});

export const deleteOrder = TryCatch(async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(new ErrorHandler("Enter Order Id", 400));
  }

  const order = await Order.findById(id);
  if (!order) return next(new ErrorHandler("Order Not Found", 404));

  await order.deleteOne();

  RevailidateCache({
    product: false,
    order: true,
    admin: true,
    userId: order.user,
    orderid: String(order._id),
  });

  res.status(200).json(new ApiResponse(200, "Order Deleted Successfully✅"));
});
