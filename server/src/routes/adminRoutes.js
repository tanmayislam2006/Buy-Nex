const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

router.get("/seller-application", adminController.getSellerApplications);
router.post("/seller-application", adminController.createSellerApplication);
router.put("/seller-application/:id", adminController.updateSellerApplication);
router.delete("/seller-application/:id", adminController.deleteSellerApplication);
router.patch("/admin-update/:id", adminController.adminUpdateUser);
router.get("/admin-dashboard", adminController.getAdminDashboard);

module.exports = router;
