import express from "express";
import { createProduct, getCategories, getSingalProducts, getLatestProduct, deleteProducts, UpdateProduct, } from "../controller/product.js";
import { singleUpload } from "../middleware/multer.js";
import { adminOnly } from "../middleware/auth.js";
const app = express.Router();
// /api/v1/product/create
app.post("/create", adminOnly, singleUpload, createProduct);
// api/v1/products/categories
app.get("/categories", getCategories);
//api/v1/products/latest -> get latest 5 products
app.get("/latest", getLatestProduct);
app
    .route("/:id")
    .get(adminOnly, getSingalProducts)
    .delete(adminOnly, deleteProducts)
    .put(adminOnly, singleUpload, UpdateProduct);
export default app;
