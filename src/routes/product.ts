import express from 'express'
import { createProduct } from '../controller/product.js';
import { singleUpload } from '../middleware/multer.js';
const app = express.Router();

// /api/v1/product/create
app.post("/create",singleUpload,  createProduct)


export default  app;
