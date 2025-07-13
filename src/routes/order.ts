import express from "express";
import {newOrder} from '../controller/order.js'

const app = express.Router();

//router -> api/v1/order/new
app.post("/new", newOrder);

export default app;
