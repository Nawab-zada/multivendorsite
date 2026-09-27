const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(6).max(100).required(),
  role: Joi.string().valid("customer", "vendor").optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(6).max(100).required(),
});

module.exports = {
  registerSchema,
  loginSchema,
};
