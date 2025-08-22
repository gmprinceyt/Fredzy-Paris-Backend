import mongoose from "mongoose";
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Enter Product Name"]
    },
    category: {
        type: String,
        required: [true, "Enter category Name"],
        trim: true
    },
    price: {
        type: Number,
        required: [true, "Enter Price Name"]
    },
    stock: {
        type: Number,
        required: [true, "Enter Product Name"]
    },
    discription: {
        type: String,
        required: [true, "Enter discription Name"]
    },
    photo: {
        type: String,
        require: [true, "Enter Photo"]
    }
}, { timestamps: true });
export const Product = mongoose.model("Product", schema);
//# sourceMappingURL=product.js.map