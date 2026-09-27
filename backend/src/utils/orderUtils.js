const Cart = require("../models/Cart");
const Product = require("../models/Product");
const Order = require("../models/Order");

const generateOrderNumber = require("./generateOrderNumber");
const calculateTotals = require("./calculateTotals");
const buildOrderItems = require("./buildOrderItems");
const validateInventory = require("./validateInventory");

const validateCart = async (userId, session = null) => {
  const query = Cart.findOne({ user: userId }).populate("items.product");
  const cart = session ? await query.session(session) : await query;

  if (!cart) {
    throw { status: 404, message: "Cart not found" };
  }

  if (cart.items.length === 0) {
    throw { status: 400, message: "Your cart is empty" };
  }

  return cart;
};

const saveOrder = async (orderData, session = null) => {
  const order = await Order.create([orderData], session ? { session } : {});
  return order[0];
};

const reduceStock = async (cartItems, session = null) => {
  for (const item of cartItems) {
    await Product.findByIdAndUpdate(
      item.product._id,
      { $inc: { stock: -item.quantity } },
      session ? { session } : {}
    );
  }
};

const clearCart = async (cart, session = null) => {
  await Cart.findByIdAndUpdate(
    cart._id,
    { items: [] },
    session ? { session } : {}
  );
};

module.exports = {
  validateCart,
  validateInventory,
  buildOrderItems,
  calculateTotals,
  generateOrderNumber,
  saveOrder,
  reduceStock,
  clearCart,
};
