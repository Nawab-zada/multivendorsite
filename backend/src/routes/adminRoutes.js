const express = require("express");

const protect = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

const {
  getDashboard,
  getPendingVendors,
  getUsers,
  getOrders,
  approveVendor,
  rejectVendor,
} = require("../controllers/adminController");

const router = express.Router();

router.get("/dashboard", protect, authorize("admin"), getDashboard);

router.get(
  "/vendors/pending",
  protect,
  authorize("admin"),
  getPendingVendors
);

router.get("/users", protect, authorize("admin"), getUsers);
router.get("/orders", protect, authorize("admin"), getOrders);

router.patch(
  "/vendors/:id/approve",
  protect,
  authorize("admin"),
  approveVendor
);

router.patch(
  "/vendors/:id/reject",
  protect,
  authorize("admin"),
  rejectVendor
);

module.exports = router;
