import { cache } from "../app.js";
import { TryCatch } from "../middleware/error.js";
import { Order } from "../model/order.js";
import { Product } from "../model/product.js";
import { User } from "../model/user.js";
import { CalculateParcentage } from "../utils/feature.js";

export const getDesboardData = TryCatch(async (req, res) => {
  let data:string[] = [];
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

    const lastSixMonth = new Date();
    lastSixMonth.setMonth(lastSixMonth.getMonth() -6);

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

    //lastSixMonthProducts
    const  lastSixMonthOrderPromise = Order.find({
      createdAt: {
        $gte: lastSixMonth,
        $lte: today
      }
    });

    const [
      ThisMonthProducts,
      LastMonthProducts,
      ThisMonthUsers,
      LastMonthUsers,
      ThisMonthOrders,
      LastMonthOrders,
      UserCount,
      ProductCount,
      TotalsOfOrders,
      lastSixMonthOrder
     ] = await  Promise.all([
      ThisMonthProductsPromise,
      LastMonthProductsPromise,
      ThisMonthUsersPromise,
      LastMonthUsersPromise,
      ThisMonthOrdersPromise,
      LastMonthOrdersPromise,
      User.countDocuments(),
      Product.countDocuments(),
      Order.find({}).select("total"),
      lastSixMonthOrderPromise
    ]);

    const thisMonthRevenue = ThisMonthOrders.reduce((prev, cre) => prev+cre.total,0);
    const lastMonthRevenue = LastMonthOrders.reduce((prev, cre) => prev+cre.total,0);

    const percent = {
        revenue: CalculateParcentage(thisMonthRevenue,lastMonthRevenue),
        product: CalculateParcentage(ThisMonthProducts.length, LastMonthProducts.length),
        users: CalculateParcentage(ThisMonthUsers.length, LastMonthUsers.length),
        order:  CalculateParcentage(ThisMonthOrders.length, LastMonthOrders.length)
    };

    const countData = {
      totalRevenue: TotalsOfOrders.reduce((prev, cre) => prev + cre.total, 0),
      UserCount,
      ProductCount,
      OrderCount: TotalsOfOrders.length

    }

    //Last Six Month Revenue And Orders 
    const lastSixMonthOrderCount = new Array(6).fill(0)
    const lastSixMonthRevenues = new Array(6).fill(0)


    lastSixMonthOrder.forEach(orders => {
      const orderCreationDate = orders.createdAt;
      const monthDiff  = today.getMonth() - orderCreationDate.getMonth();

      lastSixMonthOrderCount[(lastSixMonthOrderCount.length - monthDiff)-1] += 1;
      lastSixMonthRevenues[(lastSixMonthRevenues.length - monthDiff) -1] += orders.total;
    });
    

    const stats = {
        dataIncresmentlastMonth: percent,
        countData,
        lastSixMonthData: {
          lastSixMonthOrderCount,
          lastSixMonthRevenues
        },
        data
    }


    //test
    res.status(200).json(stats)
    
  }
});
