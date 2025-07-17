import { cache } from "../app.js";
import { Product } from "../model/product.js";
import { orderItemsType, RevailidateCacheType } from "../types/types.js";
import { ErrorHandler } from "./utills-class.js";

async function RevailidateCache({
  product,
  order,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  admin,
  orderid,
  userId,
  productId,
}: RevailidateCacheType) {
  if (product) {
    const cacheKeys = ["categories", "latest-product", "all-product"];

    if (typeof productId === "string") cacheKeys.push(`single-${productId}`);
    if (typeof productId === "object") {
      productId.forEach((i) => cacheKeys.push(`single-${i}`));
    }
    cache.del(cacheKeys);
  }
  if (order) {
    const keys = [`orders-${userId}`, "all-order", `single-${orderid}`];
    cache.del(keys);
  }
}

function ReduceStock(orderItems: orderItemsType[]) {
  orderItems.forEach(async (orderItems) => {
    const product = await Product.findById(orderItems.productId);

    if (!product) return new ErrorHandler("Product Not Found!", 404);

    product.stock -= orderItems.quantity;

    await product.save();
  });
}


function CalculateParcentage(CreatedThisMonth: number, CreatedLastMonth:number){
  // ex- 8-2 = 6/2 =3*100=300
  if (CreatedLastMonth === 0) return CreatedThisMonth*100;
    const parcent = ((CreatedThisMonth - CreatedLastMonth)/CreatedLastMonth)*100;
    return parcent;
}

export { RevailidateCache, ReduceStock,CalculateParcentage };
