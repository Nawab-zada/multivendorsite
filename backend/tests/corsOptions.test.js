const checkOrigin = (origin, corsOptions) =>
  new Promise((resolve, reject) => {
    corsOptions.origin(origin, (error, allowed) => {
      if (error) {
        reject(error);
      } else {
        resolve(allowed);
      }
    });
  });

describe("CORS origin configuration", () => {
  const originalNodeEnv = process.env.NODE_ENV;
  const originalFrontendUrl = process.env.FRONTEND_URL;

  afterEach(() => {
    if (originalNodeEnv === undefined) {
      delete process.env.NODE_ENV;
    } else {
      process.env.NODE_ENV = originalNodeEnv;
    }

    if (originalFrontendUrl === undefined) {
      delete process.env.FRONTEND_URL;
    } else {
      process.env.FRONTEND_URL = originalFrontendUrl;
    }
  });

  it("allows configured origins and rejects localhost in production", async () => {
    process.env.NODE_ENV = "production";
    process.env.FRONTEND_URL = "https://shop.example.com, https://admin.example.com";
    jest.resetModules();
    const corsOptions = require("../src/config/corsOptions");

    await expect(checkOrigin("https://shop.example.com", corsOptions)).resolves.toBe(true);
    await expect(checkOrigin("https://admin.example.com", corsOptions)).resolves.toBe(true);
    await expect(checkOrigin("http://localhost:3000", corsOptions)).rejects.toThrow(
      "is not allowed by CORS"
    );
  });

  it("allows localhost during development", async () => {
    process.env.NODE_ENV = "development";
    delete process.env.FRONTEND_URL;
    jest.resetModules();
    const corsOptions = require("../src/config/corsOptions");

    await expect(checkOrigin("http://localhost:3000", corsOptions)).resolves.toBe(true);
  });
});