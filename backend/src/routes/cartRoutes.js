const express = require("express");

const protect = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");
const validateMiddleware = require("../middlewares/validateMiddleware");
const {
  addToCartSchema,
  updateCartQuantitySchema,
} = require("../validators/cartValidator");

const { getCart, addToCart, updateCartQuantity, removeFromCart, clearCart } = require("../controllers/cartController");

const router = express.Router();

router.get("/", protect, authorize("customer"), getCart);

router.post(
  "/add",
  protect,
  authorize("customer"),
  validateMiddleware(addToCartSchema),
  addToCart
);

router.patch(
  "/update/:productId",
  protect,
  authorize("customer"),
  validateMiddleware(updateCartQuantitySchema),
  updateCartQuantity
);

router.delete(
  "/remove/:productId",
  protect,
  authorize("customer"),
  removeFromCart
);

router.delete(
  "/clear",
  protect,
  authorize("customer"),
  clearCart
);

module.exports = router;
