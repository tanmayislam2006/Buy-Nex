const express = require("express");
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const SSLCommerzPayment = require("sslcommerz-lts");
const app = express();
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = false; //true for live, false for sandbox

app.use(
  cors({
    origin: ["http://localhost:5173", "https://buy-nex.web.app"],
    credentials: true, // If you're sending cookies/headers from frontend
  })
);
app.use(express.json());

const uri = process.env.DB_URI; // Make sure DB_URI is correctly set in your .env file
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("Hello server");
});

async function run() {
  try {
    const BuyNexDB = client.db("BuyNex");
    const usersCollection = BuyNexDB.collection("users");
    const productsCollection = BuyNexDB.collection("products");
    const blogsCollection = BuyNexDB.collection("blogs");
    const commentsCollection = BuyNexDB.collection("comments");
    const cartCollection = BuyNexDB.collection("cart");
    const orderCollection = BuyNexDB.collection("orders");
    const messagesCollection = BuyNexDB.collection("messages");
    const visitorsCollection = BuyNexDB.collection("visitors");
    const becomeASellerApplication = BuyNexDB.collection("application");
    const wishlistCollection = BuyNexDB.collection("wishlist");
    const trackingCollection = BuyNexDB.collection("productTracking");
    // visitor track
    app.post("/track-visit", async (req, res) => {
      try {
        const { sellerEmail, productId, userEmail } = req.body;

        if (!sellerEmail || !productId || !userEmail) {
          return res.status(400).json({
            error: "Seller email, productId, and userEmail are required",
          });
        }

        const ip =
          req.headers["x-forwarded-for"] || req.connection.remoteAddress;
        const userAgent = req.headers["user-agent"];

        // Check if this user already visited this product for this seller
        const existingVisit = await visitorsCollection.findOne({
          sellerEmail,
          productId,
          userEmail,
        });

        if (existingVisit) {
          // Update visit count
          await visitorsCollection.updateOne(
            { _id: existingVisit._id },
            {
              $set: { visitedAt: new Date(), ip, userAgent },
              $inc: { visitCount: 1 },
            }
          );
        } else {
          // Create new visit record
          await visitorsCollection.insertOne({
            sellerEmail,
            productId,
            userEmail,
            ip,
            userAgent,
            visitedAt: new Date(),
            visitCount: 1,
          });
        }

        res.json({ message: "Visit tracked successfully" });
      } catch (error) {
        console.error("Error tracking visit:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.get("/visitor", async (req, res) => {
      const result = await visitorsCollection.find().toArray();
      res.send(result);
    });

    // -------------------------- user api is here-----------------------
    app.get("/users", async (req, res) => {
      const role = req.query.role;
      const query = {};
      if (role) {
        query.role = role;
      }
      const user = await usersCollection.find(query).toArray();
      res.send(user);
    });
    app.get("/user/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      res.send(user);
    });
    app.get("/order-history/:userEmail", async (req, res) => {
      const { userEmail } = req.params;
      const orderHistory = await orderCollection.find({ userEmail }).toArray();
      res.send(orderHistory);
    });

    app.get("/seller-orders/:sellerEmail", async (req, res) => {
      const { sellerEmail } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      try {
        const query = {
          "products.sellerEmail": sellerEmail,
        };

        const totalOrders = await orderCollection.countDocuments(query);
        const sellerOrders = await orderCollection
          .find(query)
          .skip(skip)
          .limit(limit)
          .toArray();

        res.send({
          orders: sellerOrders,
          totalOrders,
          currentPage: page,
          totalPages: Math.ceil(totalOrders / limit),
        });
      } catch (error) {
        console.error("Error fetching seller orders:", error);
        res.status(500).send({ message: "Failed to fetch seller orders" });
      }
    });

    // --- API to Update Order Status ---
    app.patch("/orders/:id/status", async (req, res) => {
      const { id } = req.params; // The order's unique _id
      const { status, orderNumber } = req.body;
      // using the order number update the tracking status
      const orderId = orderNumber || id;
      let trackingData = {};
      if (status === "Confirmed") {
        trackingData = {
          orderId,
          step: 2,
          status,
          updatedAt: new Date(),
        };
      } else if (status === "Shipped") {
        trackingData = {
          orderId,
          step: 3,
          status,
          updatedAt: new Date(),
        };
      } else if (status === "Out for Delivery") {
        trackingData = {
          orderId,
          step: 4,
          status,
          updatedAt: new Date(),
        };
      } else if (status === "Delivered") {
        trackingData = {
          orderId,
          step: 5,
          status,
          updatedAt: new Date(),
        };
      }
      const changeTrackingData = await trackingCollection.findOneAndUpdate(
        { orderId },
        { $set: trackingData },
        { upsert: true, returnDocument: "after" }
      );
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ message: "Invalid Order ID format." });
      }

      // Check if a status was provided in the body
      if (!status) {
        return res.status(400).send({ message: "Status is required." });
      }

      try {
        // Find the order by its ID and update it
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: {
            status: status, // Update the status field with the new value
          },
        };

        const result = await orderCollection.updateOne(filter, updateDoc);

        // --- Check if the update was successful ---
        if (result.matchedCount === 0) {
          return res
            .status(404)
            .send({ message: "No order found with this ID." });
        }

        if (result.modifiedCount === 0) {
          return res
            .status(200)
            .send({ message: "Order status is already up to date." });
        }

        // Send a success response
        res.send({ message: "Order status updated successfully", result });
      } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).send({ message: "Failed to update order status" });
      }
    });

    app.post("/register", async (req, res) => {
      const email = req.body.email;
      const user = req.body;
      const existingUser = await usersCollection.findOne({ email: email });
      if (existingUser) {
        return res.status(200).send({ message: "User already exists" });
      }
      const result = await usersCollection.insertOne(user);
      res.send(result);
    });
    // Get messages between a seller and a customer
    app.get("/messages/:sellerEmail/:customerEmail", async (req, res) => {
      const { sellerEmail, customerEmail } = req.params;
      try {
        const messages = await messagesCollection
          .find({
            $or: [
              { sellerEmail, customerEmail },
              { sellerEmail: customerEmail, customerEmail: sellerEmail },
            ],
          })
          .sort({ timestamp: 1 })
          .toArray();
        res.send(messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).send({ message: "Failed to fetch messages" });
      }
    });
    app.put("/user/:email", async (req, res) => {
      const email = req.params.email;
      const updatedData = req.body;

      const filter = { email };
      const updateDoc = { $set: updatedData };
      const options = { upsert: true };

      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send(result);
    });
    app.post("/wishlist", async (req, res) => {
      const wishlistItem = req.body;
      const result = await wishlistCollection.insertOne(wishlistItem);
      res.send(result);
    });
    app.get("/user-dashboard", async (req, res) => {
      try {
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
    });
    // get user order tracking data
    app.get("/tracking", async (req, res) => {
      const email = req.query.email;
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }
      try {
        const trackingData = await trackingCollection
          .find({ userEmail: email })
          .toArray();
        res.send(trackingData);
      } catch (error) {
        console.error("Error fetching tracking data:", error);
        res.status(500).json({ error: "Failed to fetch tracking data" });
      }
    });
    app.get("/tracking/:id", async (req, res) => {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ error: "Tracking ID is required" });
      }
      try {
        const trackingData = await trackingCollection.findOne({
          trackingId: id,
        });
        if (!trackingData) {
          return res.status(404).json({ error: "Tracking data not found" });
        }
        res.send(trackingData);
      } catch (error) {
        console.error("Error fetching tracking data:", error);
        res.status(500).json({ error: "Failed to fetch tracking data" });
      }
    });

    // ---------------------------- user api is here-----------------------

    // -------------------------- PRODUCT API WITH SINGLE ENDPOINT -----------------------

    // Endpoint for all products data (including filters, counts, pagination)
    app.get("/all-product-data", async (req, res) => {
      const {
        category,
        brand,
        minPrice,
        maxPrice,
        minRating,
        sortBy,
        page,
        limit,
        search,
      } = req.query;

      let matchQuery = {};

      if (category) matchQuery.category = category;
      if (brand) matchQuery.brand = brand;
      if (minRating) matchQuery.rating = { $gte: parseFloat(minRating) };
      if (minPrice || maxPrice) {
        matchQuery.price = {};
        if (minPrice) matchQuery.price.$gte = parseFloat(minPrice);
        if (maxPrice) matchQuery.price.$lte = parseFloat(maxPrice);
      }

      if (search) {
        const regex = new RegExp(search, "i");
        matchQuery.$or = [
          { name: { $regex: regex } },
          { description: { $regex: regex } },
          { tags: { $regex: regex } },
        ];
      }

      let sortOptions = {};
      if (sortBy === "Price: Low to High") sortOptions.price = 1;
      else if (sortBy === "Price: High to Low") sortOptions.price = -1;
      else sortOptions._id = -1; // Default/Newest

      const pageNumber = parseInt(page) || 1;
      const productsPerPage = parseInt(limit) || 8;
      const skip = (pageNumber - 1) * productsPerPage;

      try {
        const result = await productsCollection
          .aggregate([
            { $match: matchQuery },
            {
              $facet: {
                products: [
                  { $sort: sortOptions },
                  { $skip: skip },
                  { $limit: productsPerPage },
                ],
                totalCount: [{ $count: "count" }],
                categoryCounts: [
                  { $group: { _id: "$category", count: { $sum: 1 } } },
                  { $project: { name: "$_id", count: 1, _id: 0 } },
                  { $sort: { name: 1 } },
                ],
                brandCounts: [
                  { $group: { _id: "$brand", count: { $sum: 1 } } },
                  { $project: { name: "$_id", count: 1, _id: 0 } },
                  { $sort: { name: 1 } },
                ],
              },
            },
          ])
          .toArray();

        const aggregatedData = result[0];
        const products = aggregatedData.products || [];
        const totalProducts =
          aggregatedData.totalCount.length > 0
            ? aggregatedData.totalCount[0].count
            : 0;
        const categoryCounts = aggregatedData.categoryCounts || [];
        const brandCounts = aggregatedData.brandCounts || [];

        res.send({
          products,
          totalProducts,
          currentPage: pageNumber,
          totalPages: Math.ceil(totalProducts / productsPerPage),
          categoryCounts,
          brandCounts,
        });
      } catch (error) {
        console.error("Error fetching all product data:", error);
        res.status(500).send({ message: "Failed to fetch product data" });
      }
    });

    app.get("/products", async (req, res) => {
      const category = req.query.category;
      const excludeId = req.query.excludeId;
      const query = {};
      if (category) {
        query.category = category;
      }

      if (excludeId) {
        query._id = { $ne: new ObjectId(excludeId) };
      }

      let cursor = productsCollection.find(query);
      if (category) {
        cursor = cursor.limit(5);
      }

      const products = await cursor.toArray();
      res.send(products);
    });

    // Endpoint for single product details (remains separate and uses _id)
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const query = { _id: new ObjectId(id) };
        const product = await productsCollection.findOne(query);
        if (!product) {
          return res.status(404).send({ message: "Product not found" });
        }
        res.send(product);
      } catch (error) {
        console.error("Error fetching single product:", error);
        res.status(500).send({ message: "Failed to fetch product" });
      }
    });
    // manage products
    app.get("/manage-products", async (req, res) => {
      try {
        let { page = 1, limit = 10, sellerEmail } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        if (!sellerEmail) {
          return res.status(400).json({ message: "Seller email is required" });
        }

        const skip = (page - 1) * limit;

        const total = await productsCollection.countDocuments({ sellerEmail });

        const products = await productsCollection
          .find({ sellerEmail })
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .toArray();

        res.json({
          products,
          total,
          page,
          totalPages: Math.ceil(total / limit),
        });
      } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Server error" });
      }
    });
    // seller ordered products here
    app.get("/seller-stats", async (req, res) => {
      const { email } = req.query;
      try {
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
    });
    // Endpoint to add a new product (remains as is)
    app.post("/products", async (req, res) => {
      const product = req.body;
      try {
        const result = await productsCollection.insertOne(product);
        res.status(201).send(result);
      } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).send({ message: "Failed to add product" });
      }
    });

    // Endpoint to delete a product
    app.delete("/products/:id", async (req, res) => {
      const { id } = req.params;
      try {
        const result = await productsCollection.deleteOne({
          _id: new ObjectId(id),
        });
        if (result.deletedCount === 0) {
          return res.status(404).send({ message: "Product not found" });
        }
        res.status(200).send({ message: "Product deleted successfully" });
      } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).send({ message: "Failed to delete product" });
      }
    });

    // Endpoint to update a product
    app.put("/products/:id", async (req, res) => {
      const { id } = req.params;
      const { _id, ...product } = req.body;
      try {
        const result = await productsCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: product }
        );
        if (result.matchedCount === 0) {
          return res.status(404).send({ message: "Product not found" });
        }
        res.status(200).send({ message: "Product updated successfully" });
      } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).send({ message: "Failed to update product" });
      }
    });

    //  ------cart API START -----------------------
    // Get cart items for a user
    app.get("/cart/:email", async (req, res) => {
      const email = req.params.email;
      try {
        const cartItems = await cartCollection
          .find({ userEmail: email })
          .toArray();
        res.send(cartItems);
      } catch (error) {
        console.error("Error fetching cart items:", error);
        res.status(500).send({ message: "Failed to fetch cart items" });
      }
    });

    // added item in cart collection
    app.post("/cart", async (req, res) => {
      const cartItem = req.body;
      const existingItem = await cartCollection.findOne({
        userEmail: cartItem.userEmail,
        productId: cartItem.productId,
      });
      try {
        if (existingItem) {
          // If the item already exists, update the quantity
          const result = await cartCollection.updateOne(
            { _id: existingItem._id },
            { $inc: { quantity: cartItem.quantity } }
          );
          return res.send(result);
        }
        const result = await cartCollection.insertOne(cartItem);
        res.send(result);
      } catch (error) {
        console.error("Error adding item to cart:", error);
        res.status(500).send({ message: "Failed to add item to cart" });
      }
    });

    // single cart item delete
    app.delete("/cart/delete/:id", async (req, res) => {
      const id = req.params.id;
      try {
        const result = await cartCollection.deleteOne({
          _id: new ObjectId(id),
        });
        res.send(result);
      } catch (error) {
        console.error("Error deleting cart item:", error);
        res.status(500).send({ message: "Failed to delete cart item" });
      }
    });

    // product quentity update API
    app.patch("/cart/update/:id", async (req, res) => {
      const id = req.params.id;
      const { quantity } = req.body;
      try {
        const result = await cartCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { quantity } }
        );
        res.send(result);
      } catch (error) {
        console.error("Error updating quantity:", error);
        res.status(500).send({ message: "Failed to update quantity" });
      }
    });

    // all cart item delete API
    app.delete("/cart/clear/:email", async (req, res) => {
      const email = req.params.email;
      try {
        const result = await cartCollection.deleteMany({ userEmail: email });
        res.send(result);
      } catch (error) {
        console.error("Error clearing cart:", error);
        res.status(500).send({ message: "Failed to clear cart" });
      }
    });

    // -------------------------- PRODUCT API END -----------------------
    // -------------------------- PAYMENT  API START -----------------------
    //sslcommerz init
    app.post("/ssl-payment-init", async (req, res) => {
      const { orderData } = req.body;
      const data = {
        total_amount: orderData.totalAmount,
        currency: "USD",
        tran_id: orderData.orderNumber,
        success_url: `http://localhost:5000/payment/success/${orderData.orderNumber}`,
        fail_url: `https://buy-nex.vercel.app/payment/fail/${orderData.orderNumber}`,
        cancel_url: "http://localhost:3030/cancel",
        ipn_url: "http://localhost:3030/ipn",
        shipping_method: "Courier",
        product_name: "Multiple Products",
        product_category: "Electronic",
        product_profile: "general",

        // ✅ Customer Info
        cus_name: orderData.shippingAddress?.name || orderData.userEmail,
        cus_email: orderData.shippingAddress?.email || orderData.userEmail,
        cus_add1: orderData.shippingAddress?.street || "N/A",
        cus_add2: orderData.shippingAddress?.area || "",
        cus_city: orderData.shippingAddress?.city || "City",
        cus_state: orderData.shippingAddress?.region || "",
        cus_postcode: "0000", // <-- placeholder since zipCode nai
        cus_country: "Bangladesh",
        cus_phone: orderData.shippingAddress?.phone || "N/A",
        cus_fax: "",

        // ✅ Shipping Info (can use same)
        ship_name: orderData.shippingAddress?.name || orderData.userEmail,
        ship_add1: orderData.shippingAddress?.street || "N/A",
        ship_add2: orderData.shippingAddress?.area || "",
        ship_city: orderData.shippingAddress?.city || "City",
        ship_state: orderData.shippingAddress?.region || "",
        ship_postcode: "0000",
        ship_country: "Bangladesh",
      };

      const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

      try {
        const apiResponse = await sslcz.init(data);
        let GatewayPageURL = apiResponse.GatewayPageURL;
        res.send(GatewayPageURL);

        // Save order in DB
        await orderCollection.insertOne(orderData);
        // save the tracking info here
        const trackingData = {
          orderId: orderData.orderNumber,
          trackingId: orderData.trackingNumber,
          userEmail: orderData.userEmail,
          step: 1,
          status: "Order Placed",
          updatedAt: new Date().toISOString(),
        };
        await trackingCollection.insertOne(trackingData);
      } catch (error) {
        console.error("Init Payment Error:", error);
        res.status(500).send({ error: "Failed to initialize payment" });
      }
    });

    app.post("/payment/success/:orderNumber", async (req, res) => {
      const { orderNumber } = req.params;
      console.log(orderNumber);
      try {
        // 1. Update the order status
        const result = await orderCollection.updateOne(
          { orderNumber },
          {
            $set: {
              paymentStatus: "Paid",
              status: "Order Placed",
            },
          }
        );

        // 2. Find the updated order
        const findOrder = await orderCollection.findOne({ orderNumber });

        const userEmail = findOrder.userEmail;
        const productIds = findOrder.products.map(
          (product) => product.productId
        );

        const deleteResult = await cartCollection.deleteMany({
          userEmail: userEmail,
          productId: { $in: productIds },
        });

        // 4. Redirect if successful
        res.redirect(`http://localhost:5173/payment-success/${orderNumber}`);
      } catch (err) {
        console.error("Payment Success Error:", err);
        res.status(500).send("Error updating order after payment success");
      }
    });

    app.post("/payment/fail/:orderNumber", async (req, res) => {
      const { orderNumber } = req.params;
      try {
        await orderCollection.deleteOne({ orderNumber });
        await trackingCollection.deleteOne({ orderId: orderNumber });
        res.redirect(`https://buy-nex.web.app/payment-fail/${orderNumber}`);
      } catch (err) {
        console.error("Payment Fail Error:", err);
        res.status(500).send("Error handling failed payment");
      }
    });

    // -------------------------- PAYMENT  API END -----------------------

    // -------------------------- BLOGS API START -----------------------

    app.get("/blogs", async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;
        const search = req.query.search || "";
        const category = req.query.category || "";

        // Build filter object
        let filter = {};
        if (search) {
          filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { author: { $regex: search, $options: "i" } },
          ];
        }
        if (category) {
          filter.category = category;
        }

        const total = await blogsCollection.countDocuments(filter);
        const blogs = await blogsCollection
          .find(filter)
          .skip(skip)
          .limit(limit)
          .toArray();

        res.json({
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
          blogs,
        });
      } catch (err) {
        console.error("Error fetching paginated blogs:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    app.get("/blog/:id", async (req, res) => {
      const { id } = req.params;
      try {
        const query = { _id: new ObjectId(id) };
        const blog = await blogsCollection.findOne(query);
        if (!blog) {
          return res.status(404).send({ message: "Product not found" });
        }
        res.send(blog);
      } catch (error) {
        console.error("Error fetching single product:", error);
        res.status(500).send({ message: "Failed to fetch product" });
      }
    });

    app.post("/blogs", async (req, res) => {
      const blogs = req.body;
      blogs.createdAt = new Date().toISOString();
      try {
        const result = await blogsCollection.insertOne(blogs);
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Failed to add blog" });
      }
    });
    // Recent articles and category
    app.get("/articles-category", async (req, res) => {
      try {
        const recentArticles = await blogsCollection
          .find()
          .sort({ createdAt: -1 })
          .limit(3)
          .toArray();

        const categories = await blogsCollection.distinct("category");

        res.send({ recentArticles, categories });
      } catch (error) {
        console.error("🔥 Error fetching data:", error.message);
        res
          .status(500)
          .send({ message: "Failed to fetch recent articles or categories" });
      }
    });

    // Get comments for a blog
    app.get("/blog/:id/comments", async (req, res) => {
      const blogId = req.params.id;
      try {
        const comments = await commentsCollection
          .find({ blogId })
          .sort({ createdAt: -1 })
          .toArray();
        res.json(comments);
      } catch (error) {
        res.status(500).json({ error: "Failed to fetch comments" });
      }
    });

    // Add a comment to a blog
    app.post("/blog/:id/comments", async (req, res) => {
      const blogId = req.params.id;
      const { author, email, text } = req.body;
      const comment = {
        blogId,
        author,
        email,
        text,
        createdAt: new Date().toISOString(),
        likes: [],
        replies: [],
      };
      try {
        const result = await commentsCollection.insertOne(comment);
        res.json(result);
      } catch (error) {
        res.status(500).json({ error: "Failed to add comment" });
      }
    });

    // Delete a comment
    app.delete("/blog/:id/comments/:commentId", async (req, res) => {
      const { commentId } = req.params;
      try {
        await commentsCollection.deleteOne({
          _id: new ObjectId(commentId),
        });
        res.json({ success: true });
      } catch (error) {
        res.status(500).json({ error: "Failed to delete comment" });
      }
    });

    // Edit a comment
    app.put("/blog/:id/comments/:commentId", async (req, res) => {
      const { commentId } = req.params;
      const { text } = req.body;
      try {
        await commentsCollection.updateOne(
          { _id: new ObjectId(commentId) },
          { $set: { text } }
        );
        res.json({ success: true });
      } catch (error) {
        res.status(500).json({ error: "Failed to update comment" });
      }
    });

    // Reply to a comment
    app.post("/blog/:id/comments/:commentId/reply", async (req, res) => {
      const { commentId } = req.params;
      const { author, email, text } = req.body;
      const replyObj = {
        _id: new ObjectId(),
        author,
        email,
        text,
        createdAt: new Date().toISOString(),
        likes: [],
        replies: [],
      };
      try {
        await commentsCollection.updateOne(
          { _id: new ObjectId(commentId) },
          { $push: { replies: replyObj } }
        );
        res.json({ success: true, reply: replyObj });
      } catch (error) {
        res.status(500).json({ error: "Failed to add reply" });
      }
    });

    // Nested reply to a reply (threaded)
    app.post(
      "/blog/:id/comments/:commentId/replies/:replyId/reply",
      async (req, res) => {
        const { commentId, replyId } = req.params;
        const { author, email, text } = req.body;
        const nestedReply = {
          _id: new ObjectId(),
          author,
          email,
          text,
          createdAt: new Date().toISOString(),
          likes: [],
          replies: [],
        };
        try {
          await commentsCollection.updateOne(
            { _id: new ObjectId(commentId) },
            { $push: { "replies.$[reply].replies": nestedReply } },
            { arrayFilters: [{ "reply._id": new ObjectId(replyId) }] }
          );
          res.json({ success: true, reply: nestedReply });
        } catch (error) {
          res.status(500).json({ error: "Failed to add nested reply" });
        }
      }
    );

    // Like/unlike a comment
    app.post("/blog/:id/comments/:commentId/like", async (req, res) => {
      const { commentId } = req.params;
      const { userId } = req.body;
      try {
        const comment = await commentsCollection.findOne({
          _id: new ObjectId(commentId),
        });
        let update;
        if (comment.likes && comment.likes.includes(userId)) {
          update = { $pull: { likes: userId } };
        } else {
          update = { $addToSet: { likes: userId } };
        }
        await commentsCollection.updateOne(
          { _id: new ObjectId(commentId) },
          update
        );
        res.json({ success: true });
      } catch (error) {
        res.status(500).json({ error: "Failed to like/unlike comment" });
      }
    });

    // Like/unlike a reply
    app.post(
      "/blog/:id/comments/:commentId/replies/:replyId/like",
      async (req, res) => {
        const { commentId, replyId } = req.params;
        const { userId } = req.body;
        try {
          const comment = await commentsCollection.findOne({
            _id: new ObjectId(commentId),
          });
          const reply = comment.replies.find(
            (r) => r._id.toString() === replyId
          );
          let update;
          if (reply.likes && reply.likes.includes(userId)) {
            update = { $pull: { "replies.$[reply].likes": userId } };
          } else {
            update = { $addToSet: { "replies.$[reply].likes": userId } };
          }
          await commentsCollection.updateOne(
            { _id: new ObjectId(commentId) },
            update,
            { arrayFilters: [{ "reply._id": new ObjectId(replyId) }] }
          );
          res.json({ success: true });
        } catch (error) {
          res.status(500).json({ error: "Failed to like/unlike reply" });
        }
      }
    );

    // Edit a reply
    app.put(
      "/blog/:id/comments/:commentId/replies/:replyId",
      async (req, res) => {
        const { commentId, replyId } = req.params;
        const { text } = req.body;
        try {
          await commentsCollection.updateOne(
            { _id: new ObjectId(commentId) },
            { $set: { "replies.$[reply].text": text } },
            { arrayFilters: [{ "reply._id": new ObjectId(replyId) }] }
          );
          res.json({ success: true });
        } catch (error) {
          res.status(500).json({ error: "Failed to update reply" });
        }
      }
    );

    // Delete a reply
    app.delete(
      "/blog/:id/comments/:commentId/replies/:replyId",
      async (req, res) => {
        const { commentId, replyId } = req.params;
        try {
          await commentsCollection.updateOne(
            { _id: new ObjectId(commentId) },
            { $pull: { replies: { _id: new ObjectId(replyId) } } }
          );
          res.json({ success: true });
        } catch (error) {
          res.status(500).json({ error: "Failed to delete reply" });
        }
      }
    );

    // -------------------------- BLOGS API END -----------------------
    app.get("/order", async (req, res) => {
      const result = await orderCollection.find().toArray();
      res.send(result);
    });

    app.delete("/order", async (req, res) => {
      try {
        const result = await orderCollection.deleteMany({});
        res.send(result);
      } catch (error) {
        console.error("Error deleting orders:", error);
        res.status(500).send({ message: "Failed to delete orders" });
      }
    });
    // -------------------------- SELLER API START -----------------------
    // Seller Dashboard Data API
    app.get("/seller-dashboard-data/:email", async (req, res) => {
      const { email } = req.params;
      const sellerEmail = email;

      if (!sellerEmail) {
        return res.status(400).json({ message: "Seller email is required" });
      }

      try {
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
    });
    // -------------------------- SELLER API END -----------------------

    // -------------------------- AI ASSISTANT  API START -----------------------
    // Ensure you have express.json() middleware for parsing request bodies
    // app.use(express.json({ limit: '5mb' })); // Increase limit to handle larger Base64 images

    app.post("/api/ai-chat", async (req, res) => {
      const { message, image } = req.body;

      // Check if a message or an image was provided
      if (!message && !image) {
        return res.status(400).send({ error: "No message or image provided." });
      }

      // Construct the payload to send to n8n
      // Only include the fields that are present
      const n8nPayload = {
        ...(message && { message: message }),
        ...(image && { image: image }),
      };

      try {
        const n8nResponse = await fetch(
          "https://jaofor2390.app.n8n.cloud/webhook/read-chat",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(n8nPayload),
          }
        );

        // Error handling for n8n response
        if (!n8nResponse.ok) {
          const errorText = await n8nResponse.text();
          console.error(
            `n8n webhook responded with status ${n8nResponse.status}: ${errorText}`
          );
          return res
            .status(n8nResponse.status)
            .send({ error: "Error from AI service", details: errorText });
        }

        const contentType = n8nResponse.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const rawText = await n8nResponse.text();
          console.error(
            "n8n webhook did not respond with JSON. Raw response:",
            rawText
          );
          return res.status(500).send({
            error: "AI service did not return a valid JSON response.",
          });
        }

        const data = await n8nResponse.json();
        // Ensure 'output' property exists in the response from n8n
        if (data && data.output) {
          res.send({ reply: data.output });
        } else {
          console.error(
            "n8n response did not contain an 'output' property:",
            data
          );
          res.status(500).send({
            error: "AI service response malformed or missing 'output'.",
          });
        }
      } catch (error) {
        console.error("Error communicating with n8n webhook:", error);
        res.status(500).send({
          error: "Failed to connect to AI service or parse its response.",
        });
      }
    });

    // -------------------------- AI ASSISTANT  API END -----------------------
    // -------------------------- ADMIN API START -----------------------
    // get all seller applications
    app.get("/seller-application", async (req, res) => {
      try {
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
    });

    app.post("/seller-application", async (req, res) => {
      const applicationData = req.body;
      try {
        const existingApplication = await becomeASellerApplication.findOne({
          sellerEmail: applicationData.sellerEmail,
        });
        if (existingApplication) {
          return res.send({
            message: "You have already applied to become a seller.",
          });
        }
        const result = await becomeASellerApplication.insertOne(
          applicationData
        );
        res
          .status(201)
          .send({ success: true, applicationId: result.insertedId });
      } catch (error) {
        console.error("Error creating seller application:", error);
        res.status(500).send({ error: "Failed to create seller application." });
      }
    });

    app.put("/seller-application/:id", async (req, res) => {
      const { id } = req.params;
      const updatedData = req.body;
      try {
        const result = await becomeASellerApplication.updateOne(
          { _id: new ObjectId(id) },
          { $set: updatedData }
        );
        const changeUserRole = await usersCollection.updateOne(
          { email: updatedData.email },
          { $set: { role: "seller" } }
        );

        if (result.matchedCount === 0) {
          return res.status(404).send({ error: "Application not found." });
        }
        res
          .status(200)
          .send({ success: true, message: "Application updated." });
      } catch (error) {
        console.error("Error updating seller application:", error);
        res.status(500).send({ error: "Failed to update seller application." });
      }
    });

    app.delete("/seller-application/:id", async (req, res) => {
      const { id } = req.params;
      try {
        const result = await becomeASellerApplication.deleteOne({
          _id: new ObjectId(id),
        });
        if (result.deletedCount === 0) {
          return res.status(404).send({ error: "Application not found." });
        }
        res
          .status(200)
          .send({ success: true, message: "Application deleted." });
      } catch (error) {
        console.error("Error deleting seller application:", error);
        res.status(500).send({ error: "Failed to delete seller application." });
      }
    });
    app.patch("/admin-update/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const updateData = req.body;

        const result = await usersCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: updateData }
        );

        if (result.modifiedCount === 0) {
          return res
            .status(404)
            .json({ message: "User not found or no changes" });
        }

        res.json({ message: "User updated successfully" });
      } catch (error) {
        res.status(500).json({ message: "Failed to update user", error });
      }
    });
    app.get("/admin-dashboard", async (req, res) => {
      try {
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
    });

    // -------------------------- ADMIN API END -----------------------
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  const time = new Date().toLocaleTimeString();
  console.log(`🚀 Server is running on http://localhost:${port} at ${time}`);
});
