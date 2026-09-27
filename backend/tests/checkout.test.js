const request = require("supertest");

jest.mock("../src/models/Order", () => ({
  create: jest.fn(),
}));

jest.mock("../src/utils/orderUtils", () => ({
  validateCart: jest.fn(),
}));

jest.mock("../src/services/validateInventory", () => jest.fn());
jest.mock("../src/utils/groupProductsByVendor", () => jest.fn());
jest.mock("../src/services/createVendorOrders", () => jest.fn());
jest.mock("../src/services/updateInventory", () => jest.fn());
jest.mock("../src/services/clearCart", () => jest.fn());

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mock-token"),
  verify: jest.fn(),
}));

const app = require("../src/app");
const mongoose = require("mongoose");
const Order = require("../src/models/Order");
const { validateCart } = require("../src/utils/orderUtils");
const validateInventory = require("../src/services/validateInventory");
const groupProductsByVendor = require("../src/utils/groupProductsByVendor");
const createVendorOrders = require("../src/services/createVendorOrders");
const updateInventory = require("../src/services/updateInventory");
const clearCart = require("../src/services/clearCart");
const jwt = require("jsonwebtoken");

beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_ACCESS_SECRET = "test-access";
  jwt.verify.mockReturnValue({ userId: "customer-1", role: "customer" });

  const session = {
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    abortTransaction: jest.fn(),
    endSession: jest.fn(),
  };

  jest.spyOn(mongoose, 'startSession').mockResolvedValue(session);

  validateCart.mockResolvedValue({
    _id: "cart-1",
    items: [
      {
        product: { _id: "product-1", name: "Widget", price: 100 },
        quantity: 1,
        subtotal: 100,
      },
    ],
  });
  validateInventory.mockResolvedValue();
  groupProductsByVendor.mockReturnValue({
    "vendor-1": {
      vendor: "vendor-1",
      items: [
        {
          product: { _id: "product-1", name: "Widget", price: 100 },
          quantity: 1,
          subtotal: 100,
        },
      ],
      subtotal: 100,
    },
  });
  createVendorOrders.mockResolvedValue(["vendor-order-1"]);
  updateInventory.mockResolvedValue();
  clearCart.mockResolvedValue();
  Order.create.mockResolvedValue([
    {
      _id: "order-1",
      save: jest.fn().mockResolvedValue(true),
    },
  ]);
});

describe("Checkout routes", () => {
  it("creates an order and clears the cart", async () => {
    const res = await request(app)
      .post("/api/orders")
      .set("Authorization", "Bearer token")
      .send({
        shippingAddress: {
          fullName: "Alice Doe",
          phone: "1234567890",
          country: "Pakistan",
          province: "Punjab",
          city: "Lahore",
          address: "123 Test Street",
          postalCode: "54000",
        },
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/success/i);
  });
});
