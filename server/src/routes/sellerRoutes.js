const express = require("express");
const router = express.Router();
const sellerController = require("../controllers/sellerController");

router.get("/seller-stats", sellerController.getSellerStats);
router.get("/seller-dashboard-data/:email", sellerController.getSellerDashboardData);

module.exports = router;
