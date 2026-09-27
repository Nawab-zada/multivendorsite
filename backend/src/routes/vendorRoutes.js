const express = require("express");

const protect = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");
const { requestVendorAccount } = require("../controllers/vendorController");
const {
  getVendorOrders,
  getVendorOrderById,
  confirmVendorOrder,
  packVendorOrder,
  shipVendorOrder,
  deliverVendorOrder,
} = require("../controllers/vendorOrderController");

const router = express.Router();

router.post(
  "/request",
  protect,
  authorize("customer"),
  requestVendorAccount
);

router.get("/orders", protect, authorize("vendor", "admin"), getVendorOrders);
router.get("/orders/:id", protect, authorize("vendor", "admin"), getVendorOrderById);
router.patch("/orders/:id/confirm", protect, authorize("vendor", "admin"), confirmVendorOrder);
router.patch("/orders/:id/pack", protect, authorize("vendor", "admin"), packVendorOrder);
router.patch("/orders/:id/ship", protect, authorize("vendor", "admin"), shipVendorOrder);
router.patch("/orders/:id/deliver", protect, authorize("vendor", "admin"), deliverVendorOrder);

module.exports = router;
