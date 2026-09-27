const Category = require("../models/Category");
const asyncHandler = require("../utils/asyncHandler");

const createCategory = asyncHandler(async (req, res) => {
    const { name, slug, description, image } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Name and slug are required",
      });
    }

    const existingCategory = await Category.findOne({
      $or: [{ name }, { slug }],
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name,
      slug,
      description,
      image,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
});

const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({
      isActive: true,
    }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
});

const getAdminCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({}).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
});

const getCategoryById = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category || !category.isActive) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      category,
    });
});

const updateCategory = asyncHandler(async (req, res) => {
    const { name, slug, description, image, isActive } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    if (name !== undefined) category.name = name;
    if (slug !== undefined) category.slug = slug;
    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
});

const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    category.isActive = false;

    await category.save();

    res.status(200).json({
      success: true,
      message: "Category deactivated successfully",
    });
});

module.exports = {
  createCategory,
  getCategories,
  getAdminCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
