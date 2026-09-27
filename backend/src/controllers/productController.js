const Product = require("../models/Product");
const Category = require("../models/Category");
const asyncHandler = require("../utils/asyncHandler");

const createProduct = asyncHandler(async (req, res) => {
    const { name, description, brand, price, stock, images, category } = req.body;

    if (!name || !description || price === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, description, price and category are required",
      });
    }

    const existingCategory = await Category.findOne({
      _id: category,
      isActive: true,
    });

    if (!existingCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const product = await Product.create({
      vendor: req.user.userId,
      name,
      description,
      brand,
      price,
      stock: stock || 0,
      images: images || [],
      category,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
});

const getProducts = asyncHandler(async (req, res) => {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {
      isActive: true,
    };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};

      if (minPrice !== undefined) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice !== undefined) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Math.max(Number(limit), 1), 100);
    const skip = (pageNumber - 1) * limitNumber;

    let sortOption = { createdAt: -1 };

    if (sort === "price_asc") sortOption = { price: 1 };
    if (sort === "price_desc") sortOption = { price: -1 };
    if (sort === "name_asc") sortOption = { name: 1 };
    if (sort === "name_desc") sortOption = { name: -1 };

    const [products, totalProducts] = await Promise.all([
      Product.find(filter)
        .populate("vendor", "name email")
        .populate("category", "name slug")
        .sort(sortOption)
        .skip(skip)
        .limit(limitNumber),
      Product.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalProducts / limitNumber);

    res.status(200).json({
      success: true,
      count: products.length,
      pagination: {
        currentPage: pageNumber,
        limit: limitNumber,
        totalProducts,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPreviousPage: pageNumber > 1,
      },
      products,
    });
});

const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
      .populate("vendor", "name email");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
});

const getVendorProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({
      vendor: req.user.userId,
    })
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
});

const updateProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.vendor.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You can only update your own products",
      });
    }

    const allowedFields = [
      "name",
      "description",
      "brand",
      "price",
      "stock",
      "images",
      "category",
      "isActive",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        product[field] = req.body[field];
      }
    });

    if (req.body.category !== undefined) {
      const existingCategory = await Category.findOne({
        _id: req.body.category,
        isActive: true,
      });

      if (!existingCategory) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
});

const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.vendor.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own products",
      });
    }

    product.isActive = false;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
});

module.exports = {
  createProduct,
  getProducts,
  getVendorProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
