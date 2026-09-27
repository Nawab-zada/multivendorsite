const express = require("express");
const protect = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get(
  "/profile",
  protect,
  authorize("customer", "vendor", "admin"),
  (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected route accessed",
    user: req.user,
  });
  }
);

module.exports = router;
