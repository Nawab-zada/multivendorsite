const VendorOrder = require("../models/VendorOrder");
const asyncHandler = require("../utils/asyncHandler");

const getVendorOrders = asyncHandler(async (req, res) => {
    const vendorId = req.user.userId;

    const orders = await VendorOrder.find({ vendor: vendorId })
      .populate({ path: "customerOrder", select: "orderNumber paymentStatus totalAmount" })
      .populate({ path: "customer", select: "name email" })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
});

const getVendorOrderById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const vendorId = req.user.userId;

    const order = await VendorOrder.findOne({ _id: id, vendor: vendorId })
      .populate({ path: "customerOrder", select: "orderNumber paymentStatus totalAmount" })
      .populate({ path: "customer", select: "name email" });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Vendor order not found",
      });
    }

    return res.status(200).json({
      success: true,
      order,
    });
});

const updateVendorOrderStatus = asyncHandler(async (req, res, nextStatus) => {
    const { id } = req.params;
    const vendorId = req.user.userId;

    const order = await VendorOrder.findOne({ _id: id, vendor: vendorId });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Vendor order not found",
      });
    }

    order.orderStatus = nextStatus;
    await order.save();

    return res.status(200).json({
      success: true,
      message: `Order marked as ${nextStatus}`,
      order,
    });
});

const confirmVendorOrder = asyncHandler(async (req, res) => {
  await updateVendorOrderStatus(req, res, "confirmed");
});
const packVendorOrder = asyncHandler(async (req, res) => {
  await updateVendorOrderStatus(req, res, "packed");
});
const shipVendorOrder = asyncHandler(async (req, res) => {
  await updateVendorOrderStatus(req, res, "shipped");
});
const deliverVendorOrder = asyncHandler(async (req, res) => {
  await updateVendorOrderStatus(req, res, "delivered");
});

module.exports = {
  getVendorOrders,
  getVendorOrderById,
  confirmVendorOrder,
  packVendorOrder,
  shipVendorOrder,
  deliverVendorOrder,
};
