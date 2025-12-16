const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "https://buy-nex.web.app"],
    credentials: true,
  })
);
app.use(express.json());

// Routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const cartRoutes = require("./routes/cartRoutes");
const blogRoutes = require("./routes/blogRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const adminRoutes = require("./routes/adminRoutes");
const miscRoutes = require("./routes/miscRoutes");

app.use(userRoutes);
app.use(productRoutes);
app.use(orderRoutes);
app.use(paymentRoutes);
app.use(cartRoutes);
app.use(blogRoutes);
app.use(sellerRoutes);
app.use(adminRoutes);
app.use(miscRoutes);

app.get("/", (req, res) => {
  res.send("Hello server");
});

module.exports = app;
