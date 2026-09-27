const errorMiddleware = (err, req, res, next) => {
  const statusCode = getStatusCode(err);
  const message = getPublicMessage(err, statusCode);

  // Keep diagnostic details in server logs, never in the public response.
  console.error({
    name: err.name,
    message: err.message,
    stack: err.stack,
    path: req.originalUrl,
    method: req.method,
  });

  const response = {
    success: false,
    message,
  };

  if (process.env.NODE_ENV !== "production" && err.stack) {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};

const getStatusCode = (err) => {
  if (err.type === "entity.parse.failed") return 400;
  if (err.name === "ValidationError" || err.name === "CastError") return 400;
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return 401;
  }
  if (err.code === 11000) return 409;

  return err.statusCode || err.status || 500;
};

const getPublicMessage = (err, statusCode) => {
  if (err.type === "entity.parse.failed") return "Invalid JSON payload";
  if (err.name === "ValidationError") return "Invalid request data";
  if (err.name === "CastError") return "Invalid resource identifier";
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return "Invalid or expired access token";
  }
  if (err.code === 11000) return "A record with these details already exists";

  if (statusCode >= 400 && statusCode < 500 && err.isOperational) {
    return err.message;
  }

  return statusCode >= 500 ? "An unexpected server error occurred" : "Request could not be completed";
};

module.exports = errorMiddleware;
