const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const VendorOrder = require("../models/VendorOrder");
const asyncHandler = require("../utils/asyncHandler");

const getDashboard = asyncHandler(async (req, res) => {
    const [
      totalCustomers,
      totalVendors,
      pendingVendors,
      totalProducts,
      totalOrders,
      pendingOrders,
    ] = await Promise.all([
      User.countDocuments({ role: "customer" }),
      User.countDocuments({ role: "vendor" }),
      User.countDocuments({ role: "vendor", vendorStatus: "pending" }),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ paymentStatus: "pending" }),
    ]);

    const revenue = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } },
    ]);

    const topVendors = await VendorOrder.aggregate([
      {
        $match: {
          paymentStatus: "paid",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "vendor",
          foreignField: "_id",
          as: "vendorDetails",
        },
      },
      {
        $unwind: "$vendorDetails",
      },
      {
        $group: {
          _id: "$vendor",
          vendorId: {
            $first: "$vendor",
          },
          vendorName: {
            $first: "$vendorDetails.name",
          },
          vendorEmail: {
            $first: "$vendorDetails.email",
          },
          totalRevenue: {
            $sum: "$totalAmount",
          },
          totalOrders: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          totalRevenue: -1,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      dashboard: {
        totalCustomers,
        totalVendors,
        pendingVendors,
        totalProducts,
        totalOrders,
        pendingOrders,
        totalRevenue: revenue.length ? revenue[0].totalRevenue : 0,
        topVendors,
      },
    });
});

const getPendingVendors = asyncHandler(async (req, res) => {
    const vendors = await User.find({
      vendorStatus: "pending",
    }).select("-password");

    res.status(200).json({
      success: true,
      count: vendors.length,
      vendors,
    });
});

const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
});

const getOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({})
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
});

const approveVendor = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.vendorStatus !== "pending") {
      return res.status(400).json({
        success: false,
        message: "No pending vendor request found",
      });
    }

    user.role = "vendor";
    user.vendorStatus = "approved";

    await user.save();

    res.status(200).json({
      success: true,
      message: "Vendor approved successfully",
      vendor: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        vendorStatus: user.vendorStatus,
      },
    });
});

const rejectVendor = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.vendorStatus !== "pending") {
      return res.status(400).json({
        success: false,
        message: "No pending vendor request found",
      });
    }

    user.vendorStatus = "rejected";

    await user.save();

    res.status(200).json({
      success: true,
      message: "Vendor request rejected",
    });
});

module.exports = {
  getDashboard,
  getPendingVendors,
  getUsers,
  getOrders,
  approveVendor,
  rejectVendor,
};
