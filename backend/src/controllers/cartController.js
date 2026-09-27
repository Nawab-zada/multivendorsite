const Cart = require("../models/Cart");
const Product = require("../models/Product");
const asyncHandler = require("../utils/asyncHandler");

const getCart = asyncHandler(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user.userId });

    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: { items: [] },
      });
    }

    await cart.populate({
      path: "items.product",
      select: "name price images stock",
    });

    return res.status(200).json({
      success: true,
      cart,
    });
});

const addToCart = asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    const { productId, quantity = 1 } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than zero",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!product.isActive) {
      return res.status(400).json({
        success: false,
        message: "Product is no longer available",
      });
    }

    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock available",
      });
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = await Cart.create({
        user: userId,
        items: [],
      });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
      });
    }

    await cart.save();

    await cart.populate({
      path: "items.product",
      select: "name price images stock",
    });

    return res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      cart,
    });
});

const updateCartQuantity = asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be greater than zero",
      });
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (!product.isActive) {
      return res.status(400).json({
        success: false,
        message: "Product is no longer available",
      });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: "Insufficient stock available",
      });
    }

    const cartItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    cartItem.quantity = quantity;

    await cart.save();

    await cart.populate({
      path: "items.product",
      select: "name price stock images",
    });

    let totalItems = 0;
    let totalPrice = 0;

    cart.items.forEach((item) => {
      totalItems += item.quantity;
      totalPrice += item.quantity * item.product.price;
    });

    return res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart,
      totalItems,
      totalPrice,
    });
});

const removeFromCart = asyncHandler(async (req, res) => {
    const userId = req.user.userId;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const cartItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    await cart.populate({
      path: "items.product",
      select: "name price stock images",
    });

    let totalItems = 0;
    let totalPrice = 0;

    cart.items.forEach((item) => {
      totalItems += item.quantity;
      totalPrice += item.quantity * item.product.price;
    });

    return res.status(200).json({
      success: true,
      message: "Product removed from cart successfully",
      cart,
      totalItems,
      totalPrice,
    });
});

const clearCart = asyncHandler(async (req, res) => {
    const userId = req.user.userId;

    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];

    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Cart cleared successfully",
      cart,
    });
});

module.exports = {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
};
