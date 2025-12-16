const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/users", userController.getUsers);
router.get("/user/:email", userController.getUserByEmail);
router.post("/register", userController.registerUser);
router.put("/user/:email", userController.updateUser);
router.get("/user-dashboard", userController.getUserDashboard);

module.exports = router;
