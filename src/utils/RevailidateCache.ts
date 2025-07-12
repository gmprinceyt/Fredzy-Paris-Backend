import { cache } from "../app.js";
import { Product } from "../model/product.js";
import { RevailidateCacheType } from "../types/types.js";

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

export default RevailidateCache;
