const express = require("express");
const router = express.Router();
const miscController = require("../controllers/miscController");

router.post("/track-visit", miscController.trackVisit);
router.get("/visitor", miscController.getVisitors);
router.get("/messages/:sellerEmail/:customerEmail", miscController.getMessages);
router.post("/api/ai-chat", miscController.aiChat);

module.exports = router;
