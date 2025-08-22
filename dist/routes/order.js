import express from "express";
import { getAllOrder, newOrder, getAllUsersOrders, getSingleOrder, deleteOrder, updateOrderStatus, } from "../controller/order.js";
import { adminOnly } from "../middleware/auth.js";
const app = express.Router();
//router -> api/v1/order/new
app.post("/new", newOrder);
//router -> api/v1/order/all
app.get("/all", adminOnly, getAllOrder);
//router -> api/v1/order/all
app.get("/user/all", getAllUsersOrders);
//router -> api/v1/order/single
app
    .route("/:id")
    .get(getSingleOrder)
    .delete(adminOnly, deleteOrder)
    .put(adminOnly, updateOrderStatus);
export default app;
//# sourceMappingURL=order.js.map