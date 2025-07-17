import { cache } from "../app.js";
import { TryCatch } from "../middleware/error.js";
import { Order } from "../model/order.js";
import { Product } from "../model/product.js";
import { User } from "../model/user.js";
import { CalculateParcentage } from "../utils/feature.js";

export const getDesboardData = TryCatch(async (req, res) => {
  let data = [];
  const key = "desboard-data";
  if (cache.has(key)) {
    data = JSON.parse(cache.get(key) as string);
  } else {
    const today = new Date();

    const thisMonth = {
      Start: new Date(today.getFullYear(), today.getMonth(), 1),
      End: today,
    };
    const lastMonth = {
      Start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
      End: new Date(today.getFullYear(), today.getMonth(), 0),
    };

    //filter data by date
    const filterForThisMonth = {
      createdAt: {
        $gte: thisMonth.Start,
        $lte: thisMonth.End,
      },
    };
    const filterForLastMonth = {
      createdAt: {
        $gte: lastMonth.Start,
        $lte: lastMonth.End,
      },
    };

    //product
    const ThisMonthProductsPromise = Product.find(filterForThisMonth);
    const LastMonthProductsPromise = Product.find(filterForLastMonth);
    //user
    const ThisMonthUsersPromise = User.find(filterForThisMonth);
    const LastMonthUsersPromise = User.find(filterForLastMonth);
    //order
    const ThisMonthOrdersPromise = Order.find(filterForThisMonth);
    const LastMonthOrdersPromise = Order.find(filterForLastMonth);

    const [
      ThisMonthProducts,
      LastMonthProducts,
      ThisMonthUsers,
      LastMonthUsers,
      ThisMonthOrders,
      LastMonthOrders,
     ] = await  Promise.all([
      ThisMonthProductsPromise,
      LastMonthProductsPromise,
      ThisMonthUsersPromise,
      LastMonthUsersPromise,
      ThisMonthOrdersPromise,
      LastMonthOrdersPromise,
    ]);

    const percent = {
        product: CalculateParcentage(ThisMonthProducts.length, LastMonthProducts.length),
        users: CalculateParcentage(ThisMonthUsers.length, LastMonthUsers.length),
        order:  CalculateParcentage(ThisMonthOrders.length, LastMonthOrders.length)
    }

    const stats = {
        percent,
        data
    }


    //test
    res.status(200).json(stats)
    
  }
});
