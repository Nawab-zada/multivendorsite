const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const requestVendorAccount = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.role === "vendor") {
      return res.status(400).json({
        success: false,
        message: "You are already a vendor",
      });
    }

    if (user.vendorStatus === "pending") {
      return res.status(400).json({
        success: false,
        message: "Vendor request is already pending",
      });
    }

    if (user.vendorStatus === "approved") {
      return res.status(400).json({
        success: false,
        message: "Vendor account is already approved",
      });
    }

    user.vendorStatus = "pending";

    await user.save();

    res.status(200).json({
      success: true,
      message: "Vendor request submitted successfully",
      vendorStatus: user.vendorStatus,
    });
});

module.exports = {
  requestVendorAccount,
};
