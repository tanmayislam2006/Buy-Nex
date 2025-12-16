const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

router.post("/ssl-payment-init", paymentController.initPayment);
router.post("/payment/success/:orderNumber", paymentController.paymentSuccess);
router.post("/payment/fail/:orderNumber", paymentController.paymentFail);

module.exports = router;
