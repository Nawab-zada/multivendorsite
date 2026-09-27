const express = require("express");

const protect = require("../middlewares/authMiddleware");
const authorize = require("../middlewares/roleMiddleware");

const {
  createCategory,
  getCategories,
  getAdminCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const router = express.Router();

// Public
router.get("/", getCategories);
router.get("/manage/all", protect, authorize("admin"), getAdminCategories);
router.get("/:id", getCategoryById);

// Admin only
router.post(
  "/",
  protect,
  authorize("admin"),
  createCategory
);

router.patch(
  "/:id",
  protect,
  authorize("admin"),
  updateCategory
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteCategory
);

module.exports = router;
