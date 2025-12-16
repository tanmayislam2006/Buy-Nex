const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.get("/order-history/:userEmail", orderController.getOrderHistory);
router.get("/seller-orders/:sellerEmail", orderController.getSellerOrders);
router.patch("/orders/:id/status", orderController.updateOrderStatus);
router.get("/tracking", orderController.getTrackingByEmail);
router.get("/tracking/:id", orderController.getTrackingById);
router.get("/order", orderController.getAllOrders);
router.delete("/order", orderController.deleteAllOrders);

module.exports = router;
