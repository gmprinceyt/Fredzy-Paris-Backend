import { TryCatch } from "../middleware/error.js";
import { Coupon } from "../model/coupon.js";
import { ApiResponse, ErrorHandler } from "../utils/utills-class.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import "dotenv/config.js";
import { Payment } from "../model/payment.js";
const razorpay = new Razorpay({
    key_id: process.env.PAYMENT_KEY_ID,
    key_secret: process.env.PAYMENT_SECRET,
});
export const createOrder = TryCatch(async (req, res, next) => {
    const { amount } = req.body;
    if (!amount)
        return next(new ErrorHandler("Enter amount", 400));
    const options = {
        amount: Number(amount) * 100,
        currency: "INR",
        receipt: crypto.randomUUID(),
    };
    const order = await razorpay.orders.create(options);
    res.status(201).json(new ApiResponse(201, "PaymentOrderCreate", order));
});
export const verify = TryCatch(async (req, res, next) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    console.log("Received data:", { razorpay_order_id, razorpay_payment_id, razorpay_signature });
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    console.log("Generated sign string:", sign);
    if (!process.env.PAYMENT_SECRET) {
        return next(new ErrorHandler("Payment Key  is not set in environment variables"));
    }
    const expectedSignature = crypto
        .createHmac("sha256", process.env.PAYMENT_SECRET)
        .update(sign.toString())
        .digest("hex");
    console.log("Expected Signature:", expectedSignature);
    console.log("Razorpay Signature (received):", razorpay_signature);
    const isAuthentic = expectedSignature === razorpay_signature;
    console.log("Is Authentic:", isAuthentic);
    if (!isAuthentic)
        return next(new ErrorHandler("Payment Verifaction failed", 400));
    //Save In Database
    await Payment.create({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
    });
    return res.status(200).json({
        message: "Payment Successfully done!",
    });
});
//Coupons
export const createCoupon = TryCatch(async (req, res, next) => {
    const { code, amount, limit } = req.body;
    if (!code || !amount) {
        return next(new ErrorHandler("Both Fields Required", 400));
    }
    const coupon = await Coupon.create({
        code,
        amount,
        limit,
    });
    res
        .status(201)
        .json(new ApiResponse(201, "coupon create successfully", coupon));
});
export const couponDiscount = TryCatch(async (req, res, next) => {
    const { code } = req.query;
    if (!code)
        return next(new ErrorHandler("please Enter coupon code ", 400));
    const coupon = await Coupon.findOne({ code });
    if (!coupon)
        return next(new ErrorHandler("Coupon Not Availble or Not existed", 404));
    if (coupon.limit === 0) {
        return next(new ErrorHandler("Coupon Limit Over", 400));
    }
    coupon.limit -= 1;
    await coupon.save();
    res
        .status(200)
        .json(new ApiResponse(200, "You Got it Discount ", coupon.amount));
});
export const getAllCoupon = TryCatch(async (req, res) => {
    const coupons = await Coupon.find();
    res.status(200).json(new ApiResponse(200, "Data fatched", coupons));
});
export const deleteCoupon = TryCatch(async (req, res, next) => {
    const { code } = req.params;
    console.log(code);
    if (!code)
        return next(new ErrorHandler("please Enter coupon code ", 400));
    const coupon = await Coupon.findOneAndDelete({ code });
    if (!coupon)
        return next(new ErrorHandler("Coupon code not found", 404));
    res.status(200).json({
        message: "Coupon Deleted Successfully",
        code: coupon,
    });
});
//# sourceMappingURL=payment.js.map