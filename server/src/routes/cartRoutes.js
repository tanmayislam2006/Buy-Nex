const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");

router.get("/cart/:email", cartController.getCartItems);
router.post("/cart", cartController.addToCart);
router.delete("/cart/delete/:id", cartController.deleteCartItem);
router.patch("/cart/update/:id", cartController.updateCartQuantity);
router.delete("/cart/clear/:email", cartController.clearCart);
router.post("/wishlist", cartController.addToWishlist);

module.exports = router;
