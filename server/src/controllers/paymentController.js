const SSLCommerzPayment = require("sslcommerz-lts");
const { getDB } = require("../config/db");

const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = false; //true for live, false for sandbox

const initPayment = async (req, res) => {
  const { orderData } = req.body;

  if (!orderData) {
      return res.status(400).send({ error: "Order data is required" });
  }

  const data = {
    total_amount: orderData.totalAmount,
    currency: "USD",
    tran_id: orderData.orderNumber,
    success_url: `https://buy-nex.vercel.app/payment/success/${orderData.orderNumber}`,
    fail_url: `https://buy-nex.vercel.app/payment/fail/${orderData.orderNumber}`,
    cancel_url: `https://buy-nex.vercel.app/payment/fail/${orderData.orderNumber}`,
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
    const db = getDB();
    const orderCollection = db.collection("orders");
    const trackingCollection = db.collection("productTracking");

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
};

const paymentSuccess = async (req, res) => {
  const { orderNumber } = req.params;
  console.log("Payment Success for order:", orderNumber);
  try {
    const db = getDB();
    const orderCollection = db.collection("orders");
    const cartCollection = db.collection("cart");

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

    if (findOrder) {
        const userEmail = findOrder.userEmail;
        const productIds = findOrder.products.map(
          (product) => product.productId
        );

        const deleteResult = await cartCollection.deleteMany({
          userEmail: userEmail,
          productId: { $in: productIds },
        });
    }

    // 4. Redirect if successful
    res.redirect(`https://buy-nex.web.app/payment-success/${orderNumber}`);
  } catch (err) {
    console.error("Payment Success Error:", err);
    res.status(500).send("Error updating order after payment success");
  }
};

const paymentFail = async (req, res) => {
  const { orderNumber } = req.params;
  try {
    const db = getDB();
    const orderCollection = db.collection("orders");
    const trackingCollection = db.collection("productTracking");

    await orderCollection.deleteOne({ orderNumber });
    await trackingCollection.deleteOne({ orderId: orderNumber });
    res.redirect(`https://buy-nex.web.app/payment-fail/${orderNumber}`);
  } catch (err) {
    console.error("Payment Fail Error:", err);
    res.status(500).send("Error handling failed payment");
  }
};

module.exports = {
  initPayment,
  paymentSuccess,
  paymentFail,
};
