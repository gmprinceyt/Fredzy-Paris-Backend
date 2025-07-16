import { Request } from "express";
import { TryCatch } from "../middleware/error.js";
import { Coupon } from "../model/coupon.js";
import { ApiResponse, ErrorHandler } from "../utils/utills-class.js";

export const createCoupon = TryCatch(
  async (
    req: Request<
      Record<string, unknown>,
      unknown,
      { code: string; amount: number, limit:number }
    >,
    res,
    next
  ) => {
    const { code, amount,limit } = req.body;

    if (!code || !amount) {
      return next(new ErrorHandler("Both Fields Required", 400));
    }

    const coupon = await Coupon.create({
      code,
      amount,
      limit
    });

    res
      .status(201)
      .json(new ApiResponse(201, "coupon create successfully", coupon));
  }
);
export const couponDiscount = TryCatch(async (req, res, next) => {
  const { code } = req.query;
  if (!code) return next(new ErrorHandler("please Enter coupon code ", 400));

  const coupon = await Coupon.findOne({ code });

  if (!coupon)
    return next(new ErrorHandler("Coupon Not Availble or Not existed", 404));

  if (coupon.limit === 0){
    return next(new ErrorHandler("Coupon Limit Over", 400))
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
  if (!code) return next(new ErrorHandler("please Enter coupon code ", 400));


  const coupon = await Coupon.findOneAndDelete({ code });
    if(!coupon ) return next(new ErrorHandler("Coupon code not found",404))


    res.status(200).json({
        message: "Coupon Deleted Successfully",
        code: coupon
    })
        
});
