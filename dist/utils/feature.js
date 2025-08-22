import { cache } from "../app.js";
import { Product } from "../model/product.js";
import { ErrorHandler } from "./utills-class.js";
function RevailidateCache({ product, order, admin, orderid, userId, productId, }) {
    if (product) {
        const cacheKeys = ["categories", "latest-product", "all-product"];
        if (typeof productId === "string")
            cacheKeys.push(`single-${productId}`);
        if (typeof productId === "object") {
            productId.forEach((i) => cacheKeys.push(`single-${i}`));
        }
        cache.del(cacheKeys);
    }
    if (order) {
        const keys = [`orders-${userId}`, "all-order", `single-${orderid}`];
        cache.del(keys);
    }
    if (admin) {
        cache.del(["dashboard-data", "pie-chart", "bar-chart", "line-chart"]);
    }
}
// Stock Reduce
function ReduceStock(orderItems) {
    orderItems.forEach(async (orderItems) => {
        const product = await Product.findById(orderItems.productId);
        if (!product)
            return new ErrorHandler("Product Not Found!", 404);
        product.stock -= orderItems.quantity;
        await product.save();
    });
}
function CalculateParcentage(CreatedThisMonth, CreatedLastMonth) {
    // ex- 8-2 = 6/2 =3*100=300
    if (CreatedLastMonth === 0)
        return CreatedThisMonth * 100;
    const parcent = (CreatedThisMonth / CreatedLastMonth) * 100;
    return Number(parcent.toFixed(0));
}
export { RevailidateCache, ReduceStock, CalculateParcentage };
//# sourceMappingURL=feature.js.map