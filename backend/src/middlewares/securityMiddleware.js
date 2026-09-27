const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const securityMiddleware = (app) => {
  app.use(limiter);
  // app.use(mongoSanitize()); // Disabled due to Express 5 req.query getter issue
  // app.use(xss()); // Disabled due to Express 5 req.query getter issue
  app.use(hpp());
};

module.exports = securityMiddleware;
