import fs from "fs";
import { Request } from "express";
import { TryCatch } from "../middleware/error.js";
import {
  CreateProductRequestBody,
  SearchBaseQuery,
  SearchRequestQuery,
} from "../types/types.js";
import { Product } from "../model/product.js";
import { ApiResponse, ErrorHandler } from "../utils/utills-class.js";
import { logger } from "../utils/logger.js";
import { SortOrder } from "mongoose";
import { cache } from "../app.js";
import {RevailidateCache} from "../utils/feature.js";

export const createProduct = TryCatch(
  async (
    req: Request<Record<string, never>, unknown, CreateProductRequestBody>,
    res,
    next
  ) => {
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

   await RevailidateCache({ product: true });
    return res
      .status(201)
      .json(new ApiResponse(201, "Product Createed Successfully", product));
  }
);

// revaildate caching  with update/create/delate & order
export const getCategories = TryCatch(async (req, res) => {
  let category = [];

  if (cache.has("categories")) {
    category = JSON.parse(cache.get("categories") as string);
  } else {
    category = await Product.distinct("category");
    cache.set("categories", JSON.stringify(category));
  }
  res.status(200).json(new ApiResponse(200, "success", category));
});

// revaildate caching  with update/create/delate & order
export const getSingalProducts = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  if (!id) return next(new ErrorHandler("Enter Id"));

  let product;

  if (cache.has(`single-${id}`)) {
    product = JSON.parse(cache.get(`single-${id}`) as string);
  } else {
    product = await Product.findById(id);
    if (!product) return next(new ErrorHandler("Products Id", 404));

    cache.set(`single-${id}`, JSON.stringify(product));
  }
  res.status(200).json(new ApiResponse(200, "success", product));
});

// revaildate caching  with update/create/delate & order
export const getLatestProduct = TryCatch(async (req, res) => {
  let product;

  if (cache.has("latest-product")) {
    product = JSON.parse(cache.get("latest-product") as string);
  } else {
    product = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    cache.set("latest-product", JSON.stringify(product));
  }
  res
    .status(200)
    .json(new ApiResponse(200, "data Fatched sucessfully", product));
});

// revaildate caching  with update/create/delate & order
export const getAllProducts = TryCatch(async (req, res) => {
  let product;

  if (cache.has("all-product")) {
    product = JSON.parse(cache.get("all-product") as string);
  } else {
    product = await Product.find({});
    cache.set("all-product", JSON.stringify(product));
  }
  res.status(200).json(new ApiResponse(200, "success", product));
});

export const deleteProducts = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  if (!id) return next(new ErrorHandler("Enter Id"));

  const product = await Product.findById(id);
  if (!product) return next(new ErrorHandler("invaild", 400));

  if (product.photo) {
    fs.rm(product.photo, (err) => {
      if (err) {
        logger.error("Error deleting photo:", err.message);
      }
    });
  } else {
    logger.info("Photo Deleted Successfuly");
  }
  await product.deleteOne();
  RevailidateCache({ product: true });

  res.status(200).json(new ApiResponse(200, "Product delete successfully"));
});

export const UpdateProduct = TryCatch(
  async (
    req: Request<Record<string, never>, unknown, CreateProductRequestBody>,
    res,
    next
  ) => {
    const id = req.params.id;
    const { name, discription, category, stock, price } = req.body;
    const photo = req.file;
    if (!photo && !name && !discription && !category && !stock && !price)
      return next(new ErrorHandler("Every Fields Are Empty", 400));

    if (!id) return next(new ErrorHandler("Enter Product Id"));

    const product = await Product.findById(id);
    if (!product) return next(new ErrorHandler("invaild ID ", 400));

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

    if (name) product.name = name;
    if (discription) product.discription = discription;
    if (category) product.category = category;
    if (stock) product.stock = stock;
    if (price) product.price = price;

    await product.save();
    RevailidateCache({ product: true });

    res
      .status(200)
      .json(new ApiResponse(200, "Product Updated successfully", product));
  }
);

export const searchProduct = TryCatch(
  async (
    req: Request<Record<string, never>, unknown, unknown, SearchRequestQuery>,
    res
  ) => {
    const { search, category, sort, price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PAR_PAGE) || 8;

    const skip = (page - 1) * limit;

    const baseQuery: SearchBaseQuery = {};
    const sortQuery: { price?: SortOrder } = {};

    if (search) {
      baseQuery.name = {
        $regex: search,
        $options: "i",
      };
    }
    if (price) {
      baseQuery.price = {
        $lte: Number(price),
      };
    }
    if (category) baseQuery["category"] = category;

    if (sort) {
      sortQuery.price = sort === "asc" ? 1 : -1;
    }

    const productPromise = Product.find(baseQuery)
      .sort(sortQuery)
      .limit(limit)
      .skip(skip);

    const [products, filterOnlyProduct] = await Promise.all([
      productPromise,
      Product.find(baseQuery),
    ]);

    const pageLength = Math.ceil(filterOnlyProduct.length / limit);
    res.status(200).json({
      success: true,
      products,
      pageLength,
    });
  }
);
