import express from "express";
import {
  getAllCoupon,
  deleteCoupon,
  createCoupon,
  couponDiscount,
} from "../controller/payment.js";
import { adminOnly } from "../middleware/auth.js";
const app = express.Router();


app.get("/coupon/discount", couponDiscount);
// api/v1/payment/coupon/new
app.post("/coupon/new", adminOnly, createCoupon);
app.get("/coupon/all", adminOnly, getAllCoupon);
app.delete("/coupon/:code", adminOnly, deleteCoupon);

export default app;
