const errorMiddleware = require("../src/middlewares/errorMiddleware");

const runMiddleware = (error) => {
  const req = { method: "GET", originalUrl: "/api/test" };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  errorMiddleware(error, req, res, jest.fn());

  return res;
};

describe("Error middleware", () => {
  beforeEach(() => {
    process.env.NODE_ENV = "production";
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("hides database cast errors", () => {
    const res = runMiddleware({
      name: "CastError",
      message: "Cast to ObjectId failed for value secret-id",
      stack: "internal stack",
    });

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid resource identifier",
    });
  });

  it("hides JWT internals", () => {
    const res = runMiddleware({
      name: "JsonWebTokenError",
      message: "jwt malformed",
    });

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid or expired access token",
    });
  });

  it("hides unexpected server errors in production", () => {
    const res = runMiddleware({
      name: "MongoServerError",
      message: "MongoServerError: connection details",
      stack: "secret stack",
    });

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "An unexpected server error occurred",
    });
  });
});