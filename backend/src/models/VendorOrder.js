const mongoose = require("mongoose");

const vendorOrderSchema = new mongoose.Schema(
  {
    customerOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    vendorOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VendorOrder",
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },

        snapshot: {
          name: String,
          image: String,
          sku: String,
          brand: String,
          category: String,
          slug: String,
          price: Number,
        },

        quantity: Number,

        subtotal: Number,
      },
    ],

    subtotal: Number,

    shippingFee: {
      type: Number,
      default: 0,
    },

    totalAmount: Number,

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "packed",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    trackingNumber: String,

    history: [
      {
        status: String,
        note: String,
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("VendorOrder", vendorOrderSchema);
