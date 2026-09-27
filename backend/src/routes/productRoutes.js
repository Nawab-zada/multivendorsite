const express = require("express");

const protect = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");
const validateMiddleware = require("../middlewares/validateMiddleware");
const {
  createProductSchema,
  updateProductSchema,
} = require("../validators/productValidator");

const {
  createProduct,
  getVendorProducts,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

// Public
router.get("/", getProducts);

// Vendor only
router.get("/vendor", protect, authorize("vendor", "admin"), getVendorProducts);

router.post(
  "/",
  protect,
  authorize("vendor", "admin"),
  validateMiddleware(createProductSchema),
  createProduct
);

router.patch(
  "/:id",
  protect,
  authorize("vendor", "admin"),
  validateMiddleware(updateProductSchema),
  updateProduct
);

router.delete(
  "/:id",
  protect,
  authorize("vendor", "admin"),
  deleteProduct
);

router.get("/:id", getProductById);

module.exports = router;
