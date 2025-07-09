import { TryCatch } from "../middleware/error.js";
import { Product } from "../model/product.js";
import { ApiResponse } from "../utils/utills-class.js";
export const createProduct = TryCatch(async (req, res) => {
    const { name, category, price, stock, discription } = req.body;
    const photo = req.file;
    const product = await Product.create({
        name,
        category,
        price,
        stock,
        discription,
        photo: photo?.path,
    });
    return res
        .status(201)
        .json(new ApiResponse(201, "Product Createed Successfully", product));
});
