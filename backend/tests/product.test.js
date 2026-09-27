const request = require("supertest");

jest.mock("../src/models/Product", () => ({
  find: jest.fn(),
  findById: jest.fn(),
  countDocuments: jest.fn(),
  create: jest.fn(),
}));

jest.mock("../src/models/Category", () => ({
  findOne: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mock-token"),
  verify: jest.fn(),
}));

const app = require("../src/app");
const Product = require("../src/models/Product");
const Category = require("../src/models/Category");
const jwt = require("jsonwebtoken");

beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_ACCESS_SECRET = "test-access";
  Category.findOne.mockResolvedValue({
    _id: "68d001abc123456789abcdef",
    isActive: true,
  });
});

describe("Product routes", () => {
  it("lists products", async () => {
    const query = {
      populate: jest.fn().mockReturnThis(),
      sort: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue([{ name: "Test Product" }]),
    };

    Product.find.mockReturnValue(query);
    Product.countDocuments.mockResolvedValue(1);

    const res = await request(app).get("/api/products");

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.products).toHaveLength(1);
  });

  it("creates a product for a vendor", async () => {
    jwt.verify.mockReturnValue({ userId: "vendor-1", role: "vendor" });
    Product.create.mockResolvedValue({
      _id: "product-1",
      name: "Test Product",
      price: 120,
      stock: 5,
    });

    const res = await request(app)
      .post("/api/products")
      .set("Authorization", "Bearer token")
      .send({
        name: "Test Product",
        description: "A product for testing",
        brand: "Test Brand",
        price: 120,
        stock: 5,
        category: "68d001abc123456789abcdef",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.product.name).toBe("Test Product");
    expect(Product.create).toHaveBeenCalledWith(
      expect.objectContaining({ vendor: "vendor-1", brand: "Test Brand" })
    );
  });
});
