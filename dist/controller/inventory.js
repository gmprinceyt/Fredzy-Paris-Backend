import { cache } from "../app.js";
import { TryCatch } from "../middleware/error.js";
import { Order } from "../model/order.js";
import { Product } from "../model/product.js";
import { User } from "../model/user.js";
import { CalculateParcentage } from "../utils/feature.js";
import { getChartDataByMonth } from "../utils/RepeatCode.js";
import { ApiResponse } from "../utils/utills-class.js";
export const getdashboardData = TryCatch(async (req, res) => {
    let stats = {};
    const key = "dashboard-data";
    if (cache.has(key)) {
        stats = JSON.parse(cache.get(key));
    }
    else {
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
        lastSixMonth.setMonth((lastSixMonth.getMonth() - 6 + 12) % 12);
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
        })
            .select(["total", "discount", "createdAt"])
            .lean();
        // latest 4 Transaction
        const latestFourTransactionPromise = Order.find({})
            .sort({ createdAt: -1 })
            .select(["orderItems", "status", "discount", "total"])
            .limit(5);
        const [ThisMonthProducts, LastMonthProducts, ThisMonthUsers, LastMonthUsers, ThisMonthOrders, LastMonthOrders, UserCount, ProductCount, TotalsOfOrders, lastSixMonthOrder, Categories, CountMaleGenderInUsers, latestFourTransaction,] = await Promise.all([
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
        const thisMonthRevenue = ThisMonthOrders.reduce((prev, cre) => prev + cre.total, 0);
        const lastMonthRevenue = LastMonthOrders.reduce((prev, cre) => prev + cre.total, 0);
        const percent = {
            revenue: CalculateParcentage(thisMonthRevenue, lastMonthRevenue),
            product: CalculateParcentage(ThisMonthProducts.length, LastMonthProducts.length),
            users: CalculateParcentage(ThisMonthUsers.length, LastMonthUsers.length),
            order: CalculateParcentage(ThisMonthOrders.length, LastMonthOrders.length),
        };
        const countData = {
            totalRevenue: TotalsOfOrders.reduce((prev, cre) => prev + cre.total, 0),
            UserCount,
            ProductCount,
            OrderCount: TotalsOfOrders.length,
        };
        //Last Six Month Revenue And Orders
        const lastSixMonthOrderCount = getChartDataByMonth({
            length: 6,
            docArr: lastSixMonthOrder,
            today,
        });
        const lastSixMonthRevenues = getChartDataByMonth({
            length: 6,
            docArr: lastSixMonthOrder,
            today,
            property: "total",
        });
        // Categories Percent of All Product Stock
        const CategoriesByProductCountPromise = Categories.map((category) => Product.countDocuments({ category }));
        const CategoriesCountByProduct = await Promise.all(CategoriesByProductCountPromise);
        const categoryCount = [];
        Categories.forEach((category, i) => {
            categoryCount.push({
                [category]: Math.round((CategoriesCountByProduct[i] / ProductCount) * 100),
            });
        });
        // Gender Redio
        const genderCount = {
            male: CountMaleGenderInUsers,
            famale: UserCount - CountMaleGenderInUsers,
        };
        //latest four transaction
        const modefiedlatestFourTransaction = [];
        latestFourTransaction.forEach((order) => {
            modefiedlatestFourTransaction.push({
                _id: order._id,
                status: order.status,
                discount: order.discount,
                quantity: order.orderItems.length,
                amount: order.total,
            });
        });
        // Add Data In State
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
        pie = JSON.parse(cache.get(key));
    }
    else {
        const allOrdersPromise = Order.find({}).select([
            "total",
            "subtotal",
            "discount",
            "tax",
            "shippingCharges",
        ]);
        const [ProcessingOrder, ShippedOrder, DeliveredOrder, ProductCount, OutOfStockProduct, allOrders, allUserCount, AllAdminCount, UsersWithDOB,] = await Promise.all([
            Order.countDocuments({ status: "Processing" }),
            Order.countDocuments({ status: "Shipped" }),
            Order.countDocuments({ status: "Delivered" }),
            Product.countDocuments(),
            Product.countDocuments({ stock: 0 }),
            allOrdersPromise,
            User.countDocuments({ role: "user" }),
            User.countDocuments({ role: "admin" }),
            User.find({}).select(["dob"]),
        ]);
        // order fullfield radion
        const orderfullfieldRadio = {
            processing: ProcessingOrder,
            shipped: ShippedOrder,
            delivered: DeliveredOrder,
        };
        // stock availadblity Data
        const stockAvailadblity = {
            inStockProduct: ProductCount - OutOfStockProduct,
            OutOfStockProduct,
        };
        const grossMargin = allOrders.reduce((prev, orders) => prev + (orders.total || 0), 0);
        const discount = allOrders.reduce((prev, orders) => prev + (orders.discount || 0), 0);
        const burnt = allOrders.reduce((prev, orders) => prev + (orders.tax || 0), 0);
        const producationCost = allOrders.reduce((prev, orders) => prev + (orders.shippingCharges || 0), 0);
        const marketingCost = Math.round((grossMargin * 20) / 100);
        const netMargin = Math.round(grossMargin - discount - producationCost - marketingCost - burnt);
        // Revenue Distribution Data
        const revenueDistribution = {
            netMargin,
            discount,
            producationCost,
            marketingCost,
            burnt,
        };
        const UsersRadio = {
            user: allUserCount,
            admin: AllAdminCount,
        };
        const ageRadio = {
            teenAge: UsersWithDOB.filter((u) => u.age < 20).length,
            adult: UsersWithDOB.filter((u) => u.age > 20 && u.age < 40).length,
            old: UsersWithDOB.filter((u) => u.age > 40).length,
        };
        pie = {
            orderfullfieldRadio,
            stockAvailadblity,
            revenueDistribution,
            UsersRadio,
            ageRadio,
        };
        cache.set(key, JSON.stringify(pie));
    }
    res.status(200).json(new ApiResponse(200, "Pie Charts Data Fetched", pie));
});
export const barChartData = TryCatch(async (req, res) => {
    let bar = {};
    const key = "bar-chart";
    if (cache.has(key)) {
        bar = JSON.parse(cache.get(key));
    }
    else {
        const today = new Date();
        const SixMonthAgo = new Date();
        SixMonthAgo.setMonth(SixMonthAgo.getMonth() - 6);
        const TwelveMonthAgo = new Date();
        TwelveMonthAgo.setMonth(TwelveMonthAgo.getMonth() - 12);
        const filterQuery = {
            createdAt: {
                $gte: SixMonthAgo,
                $lte: today,
            },
        };
        const lastSixMonthProductsPromise = Product.find(filterQuery)
            .select(["createdAt"])
            .lean();
        const lastSixMonthUsersPromise = User.find(filterQuery)
            .select(["createdAt"])
            .lean();
        const lastTwelveMonthOrdersPromise = Order.find({
            createdAt: {
                $gte: TwelveMonthAgo,
                $lte: today,
            },
        })
            .select(["createdAt"])
            .lean();
        const [FilterProducts, FilterOrders, FilterUser] = await Promise.all([
            lastSixMonthProductsPromise,
            lastTwelveMonthOrdersPromise,
            lastSixMonthUsersPromise,
        ]);
        const lastSixMonthProducts = getChartDataByMonth({
            length: 6,
            docArr: FilterProducts,
            today: today,
        });
        const lastSixMonthUsers = getChartDataByMonth({
            length: 6,
            docArr: FilterUser,
            today: today,
        });
        const lastTwelveMonthOrders = getChartDataByMonth({
            length: 12,
            docArr: FilterOrders,
            today: today,
        });
        bar = { lastSixMonthProducts, lastSixMonthUsers, lastTwelveMonthOrders };
        cache.set(key, JSON.stringify(bar));
    }
    res.status(200).json(new ApiResponse(200, "barChart Data Fetched", bar));
});
export const lineCharts = TryCatch(async (req, res) => {
    let line = {};
    const key = "line-chart";
    if (cache.has(key)) {
        line = JSON.parse(cache.get(key));
    }
    else {
        const today = new Date();
        const twelveMonth = new Date();
        twelveMonth.setMonth(twelveMonth.getMonth() - 12);
        const filterQuery = {
            createdAt: {
                $gte: twelveMonth,
                $lte: today,
            },
        };
        const lasttwavleMonthUserPromise = User.find(filterQuery)
            .select("createdAt")
            .lean();
        const lasttwavleMonthProductPromise = Product.find(filterQuery)
            .select("createdAt")
            .lean();
        const lasttwavleMonthOrderPromise = Order.find(filterQuery)
            .select(["total", "discount", "createdAt"])
            .lean();
        const [lasttwavleMonthUser, lastTwavleMonthProduct, lastTwavleMonthOrder] = await Promise.all([
            lasttwavleMonthUserPromise,
            lasttwavleMonthProductPromise,
            lasttwavleMonthOrderPromise,
        ]);
        const lastTwavleMonthUsers = getChartDataByMonth({
            length: 12,
            docArr: lasttwavleMonthUser,
            today: today,
        });
        const lastTwavleMonthProducts = getChartDataByMonth({
            length: 12,
            docArr: lastTwavleMonthProduct,
            today: today,
        });
        const lastTwavleMonthDiscounts = getChartDataByMonth({
            length: 12,
            docArr: lastTwavleMonthOrder,
            today: today,
            property: "discount",
        });
        const lastTwavleMonthRevenues = getChartDataByMonth({
            length: 12,
            docArr: lastTwavleMonthOrder,
            today: today,
            property: "total",
        });
        line = {
            lastTwavleMonthUsers,
            lastTwavleMonthProducts,
            lastTwavleMonthDiscounts,
            lastTwavleMonthRevenues,
        };
        cache.set(key, JSON.stringify(line));
    }
    res.status(200).json(new ApiResponse(200, "LineCharts data Fetched ", line));
});
//# sourceMappingURL=inventory.js.map