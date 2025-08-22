import express from "express";
import { config } from "dotenv";
import { connect } from "./utils/database.connect.js";
import { logger } from "./utils/logger.js";
import { ErrorMiddleware } from "./middleware/error.js";
import NodeCache from "node-cache";
import morgan from "morgan";
config({
    path: ".env"
});
import cors from "cors";
const app = express();
//NodeCache For Better Performance
export const cache = new NodeCache();
// Basic Middlewere
app.use(express.json()); // accept json value in Request
app.use(morgan("dev"));
app.use(cors());
app.use("/uploads", express.static('uploads'));
import userRoute from "./routes/user.js";
import productRoute from "./routes/product.js";
import orderRoutes from './routes/order.js';
import paymentRoutes from './routes/payment.js';
import inventoryRoutes from './routes/inventory.js';
//? Route Register
app.use("/api/v1/user", userRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/order", orderRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/inventory", inventoryRoutes);
//test Api 
app.get('/', (req, res) => {
    res.send("Working All ✅");
});
// Error Middleware! Make Sure This Route At Last Line of Other Routes.
app.use(ErrorMiddleware);
//? Connect Database or Server listen by Express
const PORT = process.env.PORT || 4000;
const URL = process.env.DATABASE_URL || '';
function main() {
    connect(URL).then(() => {
        app.listen(PORT, () => {
            logger.info(`Express runing  at http://localhost:${PORT}`);
        });
        app.on("error", (error) => {
            logger.error("express server failed ", error);
        });
    });
}
main();
//# sourceMappingURL=app.js.map