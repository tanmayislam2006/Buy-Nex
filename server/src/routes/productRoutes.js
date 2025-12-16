const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");

router.get("/all-product-data", productController.getAllProductData);
router.get("/products", productController.getProducts);
router.get("/products/:id", productController.getProductById);
router.get("/manage-products", productController.manageProducts);
router.post("/products", productController.addProduct);
router.delete("/products/:id", productController.deleteProduct);
router.put("/products/:id", productController.updateProduct);

module.exports = router;
