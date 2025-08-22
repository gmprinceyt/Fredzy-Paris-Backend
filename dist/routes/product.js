import express from "express";
import { createProduct, getCategories, getSingalProducts, getLatestProduct, deleteProducts, UpdateProduct, getAllProducts, searchProduct, } from "../controller/product.js";
import { singleUpload } from "../middleware/multer.js";
import { adminOnly } from "../middleware/auth.js";
const app = express.Router();
//api/v1/products/latest -> get latest 5 products
app.get("/latest", getLatestProduct);
// api/v1/products/categories
app.get("/categories", getCategories);
//api/v1/products/search -> get all product with filters
app.get("/search", searchProduct);
//? Admin Routes
// /api/v1/product/create
app.post("/create", adminOnly, singleUpload, createProduct);
//api/v1/product/admin-product
app.get("/admin-product", adminOnly, getAllProducts);
//api/v1/products/.....
app
    .route("/:id")
    .get(getSingalProducts)
    .delete(adminOnly, deleteProducts)
    .put(adminOnly, singleUpload, UpdateProduct);
export default app;
