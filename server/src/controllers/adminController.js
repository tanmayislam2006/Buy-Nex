const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

const getSellerApplications = async (req, res) => {
  try {
    const db = getDB();
    const becomeASellerApplication = db.collection("application");

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalDocs = await becomeASellerApplication.countDocuments();
    const applications = await becomeASellerApplication
      .find()
      .skip(skip)
      .limit(limit)
      .toArray();

    res.status(200).send({
      data: applications,
      totalPages: Math.ceil(totalDocs / limit),
    });
  } catch (error) {
    console.error("Error fetching seller applications:", error);
    res.status(500).send({ error: "Failed to fetch seller applications." });
  }
};

const createSellerApplication = async (req, res) => {
  const applicationData = req.body;
  try {
    const db = getDB();
    const becomeASellerApplication = db.collection("application");

    const existingApplication = await becomeASellerApplication.findOne({
      sellerEmail: applicationData.sellerEmail,
    });
    if (existingApplication) {
      return res.send({
        message: "You have already applied to become a seller.",
      });
    }
    const result = await becomeASellerApplication.insertOne(applicationData);
    res.status(201).send({ success: true, applicationId: result.insertedId });
  } catch (error) {
    console.error("Error creating seller application:", error);
    res.status(500).send({ error: "Failed to create seller application." });
  }
};

const updateSellerApplication = async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;
  try {
    const db = getDB();
    const becomeASellerApplication = db.collection("application");
    const usersCollection = db.collection("users");

    const result = await becomeASellerApplication.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );
    // eslint-disable-next-line no-unused-vars
    const changeUserRole = await usersCollection.updateOne(
      { email: updatedData.email },
      { $set: { role: "seller" } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ error: "Application not found." });
    }
    res.status(200).send({ success: true, message: "Application updated." });
  } catch (error) {
    console.error("Error updating seller application:", error);
    res.status(500).send({ error: "Failed to update seller application." });
  }
};

const deleteSellerApplication = async (req, res) => {
  const { id } = req.params;
  try {
    const db = getDB();
    const becomeASellerApplication = db.collection("application");

    const result = await becomeASellerApplication.deleteOne({
      _id: new ObjectId(id),
    });
    if (result.deletedCount === 0) {
      return res.status(404).send({ error: "Application not found." });
    }
    res.status(200).send({ success: true, message: "Application deleted." });
  } catch (error) {
    console.error("Error deleting seller application:", error);
    res.status(500).send({ error: "Failed to delete seller application." });
  }
};

const adminUpdateUser = async (req, res) => {
  try {
    const db = getDB();
    const usersCollection = db.collection("users");

    const { id } = req.params;
    const updateData = req.body;

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "User not found or no changes" });
    }

    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update user", error });
  }
};

const getAdminDashboard = async (req, res) => {
  try {
    const db = getDB();
    const orderCollection = db.collection("orders");
    const productsCollection = db.collection("products");
    const wishlistCollection = db.collection("wishlist");

    // 1. Sales Chart: Orders vs. Revenue
    const salesChartData = await orderCollection
      .aggregate([
        {
          $group: {
            _id: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: { $toDate: "$createdAt" },
              },
            },
            orders: { $sum: 1 },
            revenue: { $sum: { $toDouble: "$shippingCost" } },
          },
        },
        { $sort: { _id: 1 } },
        {
          $project: {
            _id: 0,
            name: "$_id",
            orders: 1,
            revenue: 1,
          },
        },
      ])
      .toArray();

    // 2. Total Orders & Total Sales
    const totalSalesAndOrders = await orderCollection
      .aggregate([
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalSales: { $sum: { $toDouble: "$totalAmount" } },
          },
        },
        { $project: { _id: 0, totalOrders: 1, totalSales: 1 } },
      ])
      .toArray();
    // 3. Products Sold Count (Top 7)
    const productSoldCount = await orderCollection
      .aggregate([
        { $unwind: "$products" },
        {
          $group: {
            _id: "$products.productId",
            totalSold: { $sum: "$products.quantity" },
          },
        },
        { $sort: { totalSold: -1 } }, // Sorts from most sold to least sold
        { $limit: 10 }, // Limits the result to the top 10 products
        { $addFields: { productIdObj: { $toObjectId: "$_id" } } },
        {
          $lookup: {
            from: "products",
            localField: "productIdObj",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        { $unwind: "$productDetails" },
        {
          $project: {
            _id: 0,
            productName: "$productDetails.name",
            totalSold: 1,
          },
        },
      ])
      .toArray();

    // 4. Top Wishlist Products
    const topWishlistProducts = await wishlistCollection
      .aggregate([
        {
          $group: {
            _id: "$productId",
            wishCount: { $sum: 1 },
          },
        },
        { $sort: { wishCount: -1 } },
        { $limit: 4 },
        { $addFields: { productIdObj: { $toObjectId: "$_id" } } },
        {
          $lookup: {
            from: "products",
            localField: "productIdObj",
            foreignField: "_id",
            as: "productDetails",
          },
        },
        { $unwind: "$productDetails" },
        {
          $project: {
            _id: 0,
            productName: "$productDetails.name",
            wishCount: 1,
          },
        },
      ])
      .toArray();

    // 5. Order Status Breakdown
    const orderStatusCounts = await orderCollection
      .aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
        { $project: { _id: 0, status: "$_id", count: 1 } },
      ])
      .toArray();

    // 6. Recent Products (limit 5)
    const recentProducts = await productsCollection
      .find(
        {},
        { projection: { name: 1, inventory: 1, price: 1, images: 1 } }
      )
      .sort({ _id: -1 })
      .limit(5)
      .toArray();

    const dashboardData = {
      totalOrders: totalSalesAndOrders[0]?.totalOrders || 0,
      totalSales: totalSalesAndOrders[0]?.totalSales || 0,
      totalProducts: await productsCollection.countDocuments(),
      salesChartData,
      productSoldCount,
      topWishlistProducts,
      orderStatusCounts,
      recentProducts: recentProducts.map((p) => ({
        name: p.name,
        inventory: p.inventory,
        price: p.price,
        image: p.images?.[0] || null,
      })),
    };

    res.status(200).json(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getSellerApplications,
  createSellerApplication,
  updateSellerApplication,
  deleteSellerApplication,
  adminUpdateUser,
  getAdminDashboard,
};
