const request = require("supertest");

jest.mock("../src/models/Cart", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
}));

jest.mock("../src/models/Product", () => ({
  findById: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mock-token"),
  verify: jest.fn(),
}));

const app = require("../src/app");
const Cart = require("../src/models/Cart");
const Product = require("../src/models/Product");
const jwt = require("jsonwebtoken");

beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_ACCESS_SECRET = "test-access";
  jwt.verify.mockReturnValue({ userId: "customer-1", role: "customer" });
});

describe("Cart routes", () => {
  it("returns an empty cart when the customer has no cart yet", async () => {
    Cart.findOne.mockResolvedValue(null);

    const res = await request(app)
      .get("/api/cart")
      .set("Authorization", "Bearer token");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.cart.items).toEqual([]);
  });

  it("adds a product to the cart", async () => {
    Product.findById.mockResolvedValue({
      _id: "product-1",
      name: "Test Product",
      price: 100,
      stock: 10,
      isActive: true,
    });

    Cart.findOne.mockResolvedValue(null);
    Cart.create.mockResolvedValue({
      items: [],
      save: jest.fn().mockResolvedValue(true),
      populate: jest.fn().mockResolvedValue(true),
    });

    const res = await request(app)
      .post("/api/cart/add")
      .set("Authorization", "Bearer token")
      .send({ productId: "product-1", quantity: 1 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/added to cart/i);
  });
});
