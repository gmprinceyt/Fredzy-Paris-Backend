import { cache } from "../app.js";
import { Product } from "../model/product.js";
import { orderItemsType, RevailidateCacheType } from "../types/types.js";
import { ErrorHandler } from "./utills-class.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function RevailidateCache({ product, order, admin }: RevailidateCacheType) {
  if (product) {
    const cacheKeys = ["categories", "latest-product", "all-product"];

    //`single-${id}`
    const singleProductIDs = await Product.find({}).select("_id");
    
    singleProductIDs.forEach((i)=> {
        cacheKeys.push(`single-${i._id}`)
    });

    cache.del(cacheKeys);
  }
//   if (admin) {
//   }
//   if (order) {
//   }
}


function ReduceStock(orderItems: orderItemsType[]){

  orderItems.forEach(async (oI)=> {
    const product = await Product.findById(oI.productId);

    if (!product) return new ErrorHandler("Product Not Found!", 404);

    product.stock -= oI.quantity; 

    await product.save();
    
  })
}

export  {RevailidateCache,ReduceStock};
