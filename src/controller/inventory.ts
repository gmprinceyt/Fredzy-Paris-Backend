import { cache } from "../app.js";
import { TryCatch } from "../middleware/error.js";
import { Order } from "../model/order.js";
import { Product } from "../model/product.js";
import { User } from "../model/user.js";
import { CalculateParcentage } from "../utils/feature.js";
import { ApiResponse } from "../utils/utills-class.js";

export const getdashboardData = TryCatch(async (req, res) => {
  let stats = {};
  const key = "dashboard-data";
  if (cache.has(key)) {
    stats = JSON.parse(cache.get(key) as string);
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
    lastSixMonth.setMonth(lastSixMonth.getMonth() - 6);

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
    const lastSixMonthOrderPromise = Order.find({
      createdAt: {
        $gte: lastSixMonth,
        $lte: today,
      },
    });

    // latest 4 Transaction
    const latestFourTransactionPromise = Order.find({})
      .sort({ createdAt: -1 })
      .select(["orderItems", "status", "discount", "total"])
      .limit(4);

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
      lastSixMonthOrder,
      Categories,
      CountMaleGenderInUsers,
      latestFourTransaction,
    ] = await Promise.all([
      ThisMonthProductsPromise,
      LastMonthProductsPromise,
      ThisMonthUsersPromise,
      LastMonthUsersPromise,
      ThisMonthOrdersPromise,
      LastMonthOrdersPromise,
      User.countDocuments(),
      Product.countDocuments(),
      Order.find({}).select("total"),
      lastSixMonthOrderPromise,
      Product.distinct("category"),
      User.countDocuments({ gender: "male" }),
      latestFourTransactionPromise,
    ]);

    const thisMonthRevenue = ThisMonthOrders.reduce(
      (prev, cre) => prev + cre.total,
      0
    );
    const lastMonthRevenue = LastMonthOrders.reduce(
      (prev, cre) => prev + cre.total,
      0
    );

    const percent = {
      revenue: CalculateParcentage(thisMonthRevenue, lastMonthRevenue),
      product: CalculateParcentage(
        ThisMonthProducts.length,
        LastMonthProducts.length
      ),
      users: CalculateParcentage(ThisMonthUsers.length, LastMonthUsers.length),
      order: CalculateParcentage(
        ThisMonthOrders.length,
        LastMonthOrders.length
      ),
    };

    const countData = {
      totalRevenue: TotalsOfOrders.reduce((prev, cre) => prev + cre.total, 0),
      UserCount,
      ProductCount,
      OrderCount: TotalsOfOrders.length,
    };

    //Last Six Month Revenue And Orders
    const lastSixMonthOrderCount = new Array(6).fill(0);
    const lastSixMonthRevenues = new Array(6).fill(0);

    lastSixMonthOrder.forEach((orders) => {
      const orderCreationDate = orders.createdAt;
      const monthDiff = today.getMonth() - orderCreationDate.getMonth();

      lastSixMonthOrderCount[
        lastSixMonthOrderCount.length - monthDiff - 1
      ] += 1;
      lastSixMonthRevenues[lastSixMonthRevenues.length - monthDiff - 1] +=
        orders.total;
    });

    // Categories Percent of All Product Stock
    const CategoriesByProductCountPromise = Categories.map((category) =>
      Product.countDocuments({ category })
    );
    const CategoriesCountByProduct = await Promise.all(
      CategoriesByProductCountPromise
    );

    const categoryCount: Record<string, number>[] = [];
    Categories.forEach((category, i) => {
      categoryCount.push({
        [category]: Math.round(
          (CategoriesCountByProduct[i] / ProductCount) * 100
        ),
      });
    });

    // Gender Redio
    const genderCount = {
      male: CountMaleGenderInUsers,
      famale: UserCount - CountMaleGenderInUsers,
    };

    //latest four transaction
    const modefiedlatestFourTransaction: Record<string, unknown>[] = [];
    latestFourTransaction.forEach((order) => {
      modefiedlatestFourTransaction.push({
        _id: order._id,
        status: order.status,
        discount: order.discount,
        quantity: order.orderItems.length,
        amount: order.total,
      });
    });

    stats = {
      dataIncresmentlastMonth: percent,
      countData,
      lastSixMonthData: {
        lastSixMonthOrderCount,
        lastSixMonthRevenues,
      },
      categoryCount,
      genderCount,
      modefiedlatestFourTransaction,
    };

    // Storage In Cache
    cache.set(key, JSON.stringify(stats));
  }
  res.status(200).json(new ApiResponse(200, "dashboard Data Fetched", stats));
});

export const pieChartData = TryCatch(async (req, res) => {
  let pie = {};
  const key = "pie-chart";

  if (cache.has(key)) {
    pie = JSON.parse(cache.get(key) as string);
  } else {
    const [
      ProcessingOrder,
      ShippedOrder,
      DeliveredOrder,
      ProductCount,
      OutOfStockProduct
    ] = await Promise.all([
      Order.countDocuments({ status: "Processing" }),
      Order.countDocuments({ status: "Shipped" }),
      Order.countDocuments({ status: "Delivered" }),
      Product.countDocuments(),
      Product.countDocuments({stock:0})
    ]);

    // order fullfield radio
    const orderfullfieldRadio = {
      processing: ProcessingOrder,
      shipped: ShippedOrder,
      delivered: DeliveredOrder
    }

    // stock availadblity 
    const  stockAvailadblity ={
      inStockProduct: ProductCount - OutOfStockProduct,
      OutOfStockProduct
    } 

    pie ={
      orderfullfieldRadio,
      stockAvailadblity
    }


  }

  res.status(200).json(new ApiResponse(200, "Pie Charts Data Fetched", pie));
});
