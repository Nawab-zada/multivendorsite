const express = require("express");

const protect = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");
const validateMiddleware = require("../middlewares/validateMiddleware");
const { createOrderSchema } = require("../validators/orderValidator");

const {
	createOrder,
	getMyOrders,
	getOrderById,
} = require("../controllers/orderController");

const router = express.Router();

router.post(
	"/",
	protect,
	authorize("customer"),
	validateMiddleware(createOrderSchema),
	createOrder
);
router.get("/customer", protect, authorize("customer"), getMyOrders);
router.get("/:id", protect, authorize("customer"), getOrderById);

module.exports = router;
