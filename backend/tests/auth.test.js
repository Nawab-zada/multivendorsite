const request = require("supertest");

jest.mock("../src/models/User", () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mock-token"),
  verify: jest.fn(),
}));

const app = require("../src/app");
const User = require("../src/models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

beforeEach(() => {
  jest.clearAllMocks();
  process.env.JWT_ACCESS_SECRET = "test-access";
  process.env.JWT_REFRESH_SECRET = "test-refresh";
});

describe("Auth routes", () => {
  it("registers a new user", async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      _id: "user-1",
      name: "Alice",
      email: "alice@example.com",
      role: "customer",
    });
    bcrypt.hash.mockResolvedValue("hashed-password");

    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Alice",
        email: "alice@example.com",
        password: "password123",
      });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe("alice@example.com");
  });

  it("logs in an existing user", async () => {
    User.findOne.mockResolvedValue({
      _id: "user-1",
      name: "Alice",
      email: "alice@example.com",
      password: "hashed-password",
      role: "customer",
    });
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("mock-token");

    const res = await request(app)
      .post("/api/auth/login")
      .send({
        email: "alice@example.com",
        password: "password123",
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.accessToken).toBe("mock-token");
  });
});
