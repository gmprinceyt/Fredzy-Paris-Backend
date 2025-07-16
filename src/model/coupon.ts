import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Please Enter Coupon code"],
      unique: true,
      uppercase: true
    },
    amount: {
      type: Number,
      required: true,
    },
    limit: {
      type: Number,
      default: 1 
    }
  },
  { timestamps: true }
);

export const Coupon = mongoose.model("Coupon", schema);
