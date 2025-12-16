const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

const getSellerStats = async (req, res) => {
  const { email } = req.query;
  try {
    const db = getDB();
    const productsCollection = db.collection("products");
    const orderCollection = db.collection("orders");

    const totalProducts = await productsCollection.countDocuments({
      sellerEmail: email,
    });

    const totalOrdersResult = await orderCollection
      .aggregate([
        { $unwind: "$products" },
        { $match: { "products.sellerEmail": email } },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalSales: { $sum: "$products.price" },
          },
        },
      ])
      .toArray();

    const totalOrders =
      totalOrdersResult.length > 0 ? totalOrdersResult[0].totalOrders : 0;
    const totalSales =
      totalOrdersResult.length > 0 ? totalOrdersResult[0].totalSales : 0;

    const pendingOrders = await orderCollection.countDocuments({
      "products.sellerEmail": email,
      status: { $ne: "Delivered" }, // Assuming 'Delivered' is the final status
    });

    res.send({
      totalProducts,
      totalOrders,
      totalSales,
      pendingOrders,
    });
  } catch (error) {
    console.error("Error fetching seller stats:", error);
    res.status(500).send({ message: "Failed to fetch seller statistics" });
  }
};

const getSellerDashboardData = async (req, res) => {
  const { email } = req.params;
  const sellerEmail = email;

  if (!sellerEmail) {
    return res.status(400).json({ message: "Seller email is required" });
  }

  try {
    const db = getDB();
    const productsCollection = db.collection("products");
    const orderCollection = db.collection("orders");
    const commentsCollection = db.collection("comments");
    const visitorsCollection = db.collection("visitors");

    const totalProductsCountPromise = productsCollection.countDocuments({
      sellerEmail,
    });

    const ordersDataPromise = orderCollection
      .aggregate([
        { $unwind: "$products" },
        { $match: { "products.sellerEmail": sellerEmail } },
        {
          $addFields: {
            orderDateAsDate: { $toDate: "$createdAt" },
            totalAmountNum: { $toDouble: "$totalAmount" },
          },
        },
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalSales: { $sum: "$totalAmountNum" },
            totalIncome: { $sum: "$subtotal" },
            salesByCountry: {
              $push: {
                city: "$shippingAddress.city",
                price: {
                  $multiply: ["$products.price", "$products.quantity"],
                },
              },
            },
            topSoldProducts: {
              $push: {
                productId: "$products.productId",
                productName: "$products.name",
                productImage: "$products.image",
                productPrice: "$products.price",
                quantity: "$products.quantity",
              },
            },
            recentOrders: { $push: "$$ROOT" },
          },
        },
        {
          $addFields: {
            recentOrdersSorted: {
              $sortArray: {
                input: "$recentOrders",
                sortBy: { createdAt: -1 },
              },
            },
          },
        },
        {
          $project: {
            recentOrders: { $slice: ["$recentOrdersSorted", 6] },
            totalOrders: 1,
            totalSales: { $round: ["$totalSales", 2] },
            totalIncome: { $round: ["$totalIncome", 2] },
            ordersByMonth: 1,
            salesByCountry: 1,
            topSoldProducts: 1,
          },
        },
      ])
      .toArray();

    const ordersByMonthPromise = orderCollection
      .aggregate([
        { $unwind: "$products" },
        { $match: { "products.sellerEmail": sellerEmail } },
        {
          $group: {
            _id: {
              year: { $year: { $toDate: "$createdAt" } },
              month: { $month: { $toDate: "$createdAt" } },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ])
      .toArray();

    const productsDataPromise = productsCollection
      .find({ sellerEmail })
      .limit(6)
      .toArray();

    const commentsDataPromise = commentsCollection
      .aggregate([
        {
          $lookup: {
            from: "blogs",
            localField: "blogId",
            foreignField: "_id",
            as: "blogInfo",
          },
        },
        { $unwind: "$blogInfo" },
        { $sort: { createdAt: -1 } },
        { $limit: 4 },
        {
          $project: {
            _id: 1,
            author: "$author",
            text: "$text",
            avatar: {
              $concat: [
                "https://ui-avatars.com/api/?name=",
                "$author",
                "&background=random&color=fff&bold=true",
              ],
            },
            stars: { $add: [3, { $multiply: [2, { $rand: {} }] }] },
          },
        },
      ])
      .toArray();

    const visitorsAggPromise = visitorsCollection
      .aggregate([
        { $match: { sellerEmail } },
        {
          $group: {
            _id: "$userEmail",
            totalVisitsByUser: { $sum: "$visitCount" },
          },
        },
        {
          $group: {
            _id: null,
            totalVisitors: { $sum: 1 },
            totalVisits: { $sum: "$totalVisitsByUser" },
          },
        },
      ])
      .toArray();

    const [
      totalProductsCount,
      ordersData,
      ordersByMonthData,
      productsData,
      commentsData,
      visitorsAgg,
    ] = await Promise.all([
      totalProductsCountPromise,
      ordersDataPromise,
      ordersByMonthPromise,
      productsDataPromise,
      commentsDataPromise,
      visitorsAggPromise,
    ]);

    const ordersAggData = ordersData[0] || {};
    const totalOrders = ordersAggData.totalOrders || 0;
    const totalSales = ordersAggData.totalSales || 0;
    const totalIncome = ordersAggData.totalIncome || 0;

    const monthlyOrders = Array(12).fill(0);
    ordersByMonthData.forEach(({ _id, count }) => {
      if (_id.month >= 1 && _id.month <= 12) {
        monthlyOrders[_id.month - 1] += count;
      }
    });

    const recentOrdersChart = monthlyOrders.map((orders, index) => ({
      name: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ][index],
      orders,
    }));

    // Top Products Map & Sorting
    const topProductsMap = {};
    if (ordersAggData.topSoldProducts) {
      ordersAggData.topSoldProducts.forEach((item) => {
        if (!topProductsMap[item.productId]) {
          topProductsMap[item.productId] = {
            name: item.productName,
            soldCount: 0,
            image: item.productImage,
            price: item.productPrice,
          };
        }
        topProductsMap[item.productId].soldCount += item.quantity || 1;
      });
    }
    const topProducts = Object.values(topProductsMap)
      .sort((a, b) => b.soldCount - a.soldCount)
      .slice(0, 5);

    // Top Countries By Sales
    const salesByCountry = {};
    if (ordersAggData.salesByCountry) {
      ordersAggData.salesByCountry.forEach((item) => {
        if (!salesByCountry[item.city]) {
          salesByCountry[item.city] = 0;
        }
        salesByCountry[item.city] += item.price;
      });
    }
    const topCountries = Object.entries(salesByCountry)
      .map(([city, totalSales]) => ({ _id: city, totalSales }))
      .sort((a, b) => b.totalSales - a.totalSales);

    // Product Overview Data
    const productOverview = {
      products: productsData.map((p) => ({
        ...p,
        imageURL: p.images?.[0] || "https://placehold.co/100x100",
        stockQuantity: p.inventory,
        revenue: 0,
      })),
      totalProducts: totalProductsCount,
      currentPage: 1,
      totalPages: Math.ceil(totalProductsCount / 12),
    };

    // Visitor Data
    const visitorsData = visitorsAgg[0] || {
      totalVisitors: 0,
      totalVisits: 0,
    };

    // Prepare Final Dashboard Data Response
    const dashboardData = {
      summary: {
        totalSales: `$${totalSales.toFixed(2)}`,
        totalIncome: `$${totalIncome.toFixed(2)}`,
        totalOrders,
        totalVisitors: visitorsData.totalVisitors,
        totalVisits: visitorsData.totalVisits,
        summaryChart: recentOrdersChart.slice(0, 8),
      },
      recentOrdersChart,
      topProducts,
      topCountries,
      productOverview,
      recentOrders: ordersAggData.recentOrders,
      earnings: {
        chartData: recentOrdersChart.map((d) => ({
          name: d.name,
          revenue: d.orders * 100,
          profit: d.orders * 70,
        })),
        totalRevenue: totalSales,
        totalProfit: totalIncome,
      },
      newComments: commentsData,
    };

    res.json(dashboardData);
  } catch (err) {
    console.error("Error fetching seller dashboard data:", err);
    res.status(500).json({
      message: "Failed to fetch dashboard data",
      error: err.message,
    });
  }
};

module.exports = {
  getSellerStats,
  getSellerDashboardData,
};
