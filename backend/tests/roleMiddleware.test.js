const authorize = require("../src/middlewares/roleMiddleware");

const runAuthorization = (userRole, ...allowedRoles) => {
  const req = { user: { role: userRole } };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const next = jest.fn();

  authorize(...allowedRoles)(req, res, next);

  return { res, next };
};

describe("Role boundaries", () => {
  it.each([
    ["customer", "admin"],
    ["customer", "vendor"],
    ["vendor", "admin"],
    ["vendor", "customer"],
  ])("denies %s access to %s-only actions", (userRole, allowedRole) => {
    const { res, next } = runAuthorization(userRole, allowedRole);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  it("allows an admin to access admin-only actions", () => {
    const { res, next } = runAuthorization("admin", "admin");

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("allows an admin to access vendor-enabled actions", () => {
    const { res, next } = runAuthorization("admin", "vendor", "admin");

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});