import mongoose from "mongoose";
const schema = new mongoose.Schema({
    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String,
}, { timestamps: true });
export const Payment = mongoose.model("Payment", schema);
//# sourceMappingURL=payment.js.map