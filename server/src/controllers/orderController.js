const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");

const getOrderHistory = async (req, res) => {
  const { userEmail } = req.params;
  try {
    const db = getDB();
    const orderCollection = db.collection("orders");
    const orderHistory = await orderCollection.find({ userEmail }).toArray();
    res.send(orderHistory);
  } catch (error) {
    console.error("Error fetching order history:", error);
    res.status(500).send({ message: "Failed to fetch order history" });
  }
};

const getSellerOrders = async (req, res) => {
  const { sellerEmail } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const db = getDB();
    const orderCollection = db.collection("orders");

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
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params; // The order's unique _id
  const { status, orderNumber } = req.body;

  try {
    const db = getDB();
    const orderCollection = db.collection("orders");
    const trackingCollection = db.collection("productTracking");

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

    // Only update tracking if we have valid tracking data
    if (Object.keys(trackingData).length > 0) {
        await trackingCollection.findOneAndUpdate(
            { orderId },
            { $set: trackingData },
            { upsert: true, returnDocument: "after" }
        );
    }

    if (!ObjectId.isValid(id)) {
      return res.status(400).send({ message: "Invalid Order ID format." });
    }

    // Check if a status was provided in the body
    if (!status) {
      return res.status(400).send({ message: "Status is required." });
    }

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
      return res.status(404).send({ message: "No order found with this ID." });
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
};

const getTrackingByEmail = async (req, res) => {
  const email = req.query.email;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  try {
    const db = getDB();
    const trackingCollection = db.collection("productTracking");
    const trackingData = await trackingCollection
      .find({ userEmail: email })
      .toArray();
    res.send(trackingData);
  } catch (error) {
    console.error("Error fetching tracking data:", error);
    res.status(500).json({ error: "Failed to fetch tracking data" });
  }
};

const getTrackingById = async (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ error: "Tracking ID is required" });
  }
  try {
    const db = getDB();
    const trackingCollection = db.collection("productTracking");
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
};

const getAllOrders = async (req, res) => {
  try {
    const db = getDB();
    const orderCollection = db.collection("orders");
    const result = await orderCollection.find().toArray();
    res.send(result);
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).send({ message: "Failed to fetch orders" });
  }
};

const deleteAllOrders = async (req, res) => {
  try {
    const db = getDB();
    const orderCollection = db.collection("orders");
    const result = await orderCollection.deleteMany({});
    res.send(result);
  } catch (error) {
    console.error("Error deleting orders:", error);
    res.status(500).send({ message: "Failed to delete orders" });
  }
};

module.exports = {
  getOrderHistory,
  getSellerOrders,
  updateOrderStatus,
  getTrackingByEmail,
  getTrackingById,
  getAllOrders,
  deleteAllOrders,
};
