import fs from "fs";
import { TryCatch } from "../middleware/error.js";
import { Product } from "../model/product.js";
import { ApiResponse, ErrorHandler } from "../utils/utills-class.js";
import { logger } from "../utils/logger.js";
export const createProduct = TryCatch(async (req, res, next) => {
    const { name, category, price, stock, discription } = req.body;
    const photo = req.file;
    if (!photo) {
        return next(new ErrorHandler("Please Add Photo", 400));
    }
    if (!name || !category || !price || !stock || !discription) {
        fs.rm(photo.path, (err) => {
            if (err) {
                logger.error(err?.message);
            }
        });
        return next(new ErrorHandler("Please Enter All Fields", 400));
    }
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
export const getCategories = TryCatch(async (req, res) => {
    const category = await Product.distinct("category");
    res.status(200).json(new ApiResponse(200, "success", category));
});
export const getSingalProducts = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    if (!id)
        return next(new ErrorHandler("Enter Id"));
    const product = await Product.findById(id);
    if (!product)
        return next(new ErrorHandler("Products Id", 404));
    res.status(200).json(new ApiResponse(200, "success", product));
});
export const deleteProducts = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    if (!id)
        return next(new ErrorHandler("Enter Id"));
    const product = await Product.findById(id);
    if (!product)
        return next(new ErrorHandler("invaild", 400));
    if (product.photo) {
        fs.rm(product.photo, (err) => {
            if (err) {
                logger.error("Error deleting photo:", err.message);
            }
        });
    }
    else {
        logger.info("Photo Deleted Successfuly");
    }
    await product.deleteOne();
    res.status(200).json(new ApiResponse(200, "Product delete successfully"));
});
export const getLatestProduct = TryCatch(async (req, res) => {
    const product = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    res
        .status(200)
        .json(new ApiResponse(200, "data Fatched sucessfully", product));
});
export const UpdateProduct = TryCatch(async (req, res, next) => {
    const id = req.params.id;
    const { name, discription, category, stock, price } = req.body;
    const photo = req.file;
    if (!photo && !name && !discription && !category && !stock && !price)
        return next(new ErrorHandler("Every Fields Are Empty", 400));
    if (!id)
        return next(new ErrorHandler("Enter Product Id"));
    const product = await Product.findById(id);
    if (!product)
        return next(new ErrorHandler("invaild ID ", 400));
    if (photo) {
        if (product.photo) {
            fs.rm(product.photo, (err) => {
                if (err) {
                    logger.error("Error deleting photo:", err.message);
                }
            });
        }
        product.photo = photo.path;
        logger.info("old Photo Deleted Successfuly");
    }
    if (name)
        product.name = name;
    if (discription)
        product.discription = discription;
    if (category)
        product.category = category;
    if (stock)
        product.stock = stock;
    if (price)
        product.price = price;
    await product.save();
    res.status(200).json(new ApiResponse(200, "Product Updated successfully", product));
});
