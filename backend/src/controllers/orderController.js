const mongoose = require("mongoose");
const Order = require("../models/Order");
const { validateCart } = require("../utils/orderUtils");
const asyncHandler = require("../utils/asyncHandler");
const generateOrderNumber = require("../utils/generateOrderNumber");
const validateInventory = require("../services/validateInventory");
const groupProductsByVendor = require("../utils/groupProductsByVendor");
const createVendorOrders = require("../services/createVendorOrders");
const updateInventory = require("../services/updateInventory");
const clearCart = require("../services/clearCart");

const createCustomerOrder = async (req, cart, session) => {
  const orderNumber = generateOrderNumber();
  const subtotal = cart.items.reduce((sum, item) => {
    const unitPrice = item.product?.price ?? item.price ?? 0;
    const quantity = Number(item.quantity) || 1;
    return sum + unitPrice * quantity;
  }, 0);

  const totalAmount = subtotal;

  const customerOrder = await Order.create(
    [
      {
        customer: req.user.userId,
        orderNumber,
        paymentStatus: "pending",
        orderStatus: "pending",
        shippingAddress: req.body.shippingAddress,
        paymentMethod: req.body.paymentMethod || "COD",
        subtotal,
        shippingFee: req.body.shippingFee || 0,
        tax: req.body.tax || 0,
        totalAmount,
      },
    ],
    {
      session,
    }
  );

  return customerOrder[0];
};

const createOrder = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user.userId;
    const { shippingAddress, shippingFee = 0, tax = 0, paymentMethod = "COD" } = req.body;

    const cart = await validateCart(userId, session);

    await validateInventory(cart, session);

    const vendorGroups = groupProductsByVendor(cart);

    const customerOrder = await createCustomerOrder(
      {
        ...req,
        body: {
          ...req.body,
          shippingAddress,
          shippingFee,
          tax,
          paymentMethod,
        },
      },
      cart,
      session
    );

    const vendorOrderIds = await createVendorOrders(
      vendorGroups,
      customerOrder,
      userId,
      shippingAddress,
      paymentMethod,
      session
    );

    customerOrder.vendorOrders = vendorOrderIds;
    await customerOrder.save({ session });

    await updateInventory(cart, session);
    await clearCart(cart, session);

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: customerOrder,
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    await session.endSession();
  }
});

const getMyOrders = asyncHandler(async (req, res) => {
    const userId = req.user.userId;

    const orders = await Order.find({
      customer: userId,
    })
      .populate({
        path: "vendorOrders",
      })
      .sort({
        createdAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
});

const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({
    _id: req.params.id,
    customer: req.user.userId,
  }).populate({
    path: "vendorOrders",
  });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  return res.status(200).json({
    success: true,
    order,
  });
});

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  createCustomerOrder,
};
