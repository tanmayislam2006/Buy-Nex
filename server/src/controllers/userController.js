const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

const getUsers = async (req, res) => {
  try {
    const db = getDB();
    const usersCollection = db.collection("users");
    const role = req.query.role;
    const query = {};
    if (role) {
      query.role = role;
    }
    const user = await usersCollection.find(query).toArray();
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch users" });
  }
};

const getUserByEmail = async (req, res) => {
  try {
    const db = getDB();
    const usersCollection = db.collection("users");
    const email = req.params.email;
    const query = { email: email };
    const user = await usersCollection.findOne(query);
    res.send(user);
  } catch (error) {
    res.status(500).send({ message: "Failed to fetch user" });
  }
};

const registerUser = async (req, res) => {
  try {
    const db = getDB();
    const usersCollection = db.collection("users");
    const email = req.body.email;
    const user = req.body;
    const existingUser = await usersCollection.findOne({ email: email });
    if (existingUser) {
      return res.status(200).send({ message: "User already exists" });
    }
    const result = await usersCollection.insertOne(user);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to register user" });
  }
};

const updateUser = async (req, res) => {
  try {
    const db = getDB();
    const usersCollection = db.collection("users");
    const email = req.params.email;
    const updatedData = req.body;

    const filter = { email };
    const updateDoc = { $set: updatedData };
    const options = { upsert: true };

    const result = await usersCollection.updateOne(filter, updateDoc, options);
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: "Failed to update user" });
  }
};

const getUserDashboard = async (req, res) => {
  try {
    const db = getDB();
    const orderCollection = db.collection("orders");
    const wishlistCollection = db.collection("wishlist");

    const { email } = req.query; // ?email=user@11.com

    // 1️⃣ Orders aggregation
    const ordersAgg = await orderCollection
      .aggregate([
        { $match: { userEmail: email } },
        {
          $facet: {
            summary: [
              {
                $group: {
                  _id: null,
                  totalOrders: { $sum: 1 },
                  totalSpent: { $sum: { $toDouble: "$totalAmount" } },
                  confirmOrders: {
                    $sum: {
                      $cond: [{ $eq: ["$status", "Confirmed"] }, 1, 0],
                    },
                  },
                },
              },
            ],
            recentOrders: [
              { $sort: { createdAt: -1 } },
              { $limit: 5 },
              {
                $project: {
                  _id: 0,
                  orderId: "$orderNumber",
                  product: { $first: "$products.name" },
                  date: "$createdAt",
                  status: "$status",
                  amount: "$totalAmount",
                },
              },
            ],
            monthlySpend: [
              {
                $group: {
                  _id: { $month: { $toDate: "$createdAt" } },
                  spending: { $sum: { $toDouble: "$totalAmount" } },
                },
              },
              { $sort: { _id: 1 } },
              {
                $project: {
                  _id: 0,
                  month: {
                    $arrayElemAt: [
                      [
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
                      ],
                      { $subtract: ["$_id", 1] },
                    ],
                  },
                  spending: 1,
                },
              },
            ],
          },
        },
      ])
      .toArray();

    const orderData = ordersAgg[0];

    // 2️⃣ Wishlist aggregation
    const wishlistAgg = await wishlistCollection
      .aggregate([
        { $match: { userEmail: email } },
        {
          $facet: {
            total: [{ $count: "totalWishlist" }],
            recent: [
              { $sort: { _id: -1 } },
              { $limit: 3 },
              {
                $project: {
                  _id: 0,
                  id: "$productId",
                  name: 1,
                  price: 1,
                  image: 1,
                },
              },
            ],
          },
        },
      ])
      .toArray();

    const wishlistData = wishlistAgg[0];

    // 3️⃣ Fill in missing months for monthlySpend
    const allMonths = [
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
    ];

    const monthlySpendMap = {};
    (orderData.monthlySpend || []).forEach((m) => {
      monthlySpendMap[m.month] = m.spending;
    });

    const fullMonthlySpend = allMonths.map((month) => ({
      month,
      spending: monthlySpendMap[month] || 0,
    }));

    // 4️⃣ Send final JSON
    res.json({
      summary: {
        totalOrders: orderData.summary[0]?.totalOrders || 0,
        totalSpent: orderData.summary[0]?.totalSpent || 0,
        confirmOrders: orderData.summary[0]?.confirmOrders || 0,
        totalWishlist: wishlistData.total[0]?.totalWishlist || 0,
      },
      recentOrders: orderData.recentOrders,
      wishlist: wishlistData.recent,
      monthlySpend: fullMonthlySpend,
    });
  } catch (error) {
    console.error("Error fetching user dashboard:", error);
    res.status(500).json({ error: "Failed to fetch user dashboard data" });
  }
};

module.exports = {
  getUsers,
  getUserByEmail,
  registerUser,
  updateUser,
  getUserDashboard,
};
