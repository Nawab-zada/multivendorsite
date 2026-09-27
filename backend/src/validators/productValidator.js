const Joi = require("joi");

const createProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(150).required(),
  description: Joi.string().trim().min(5).max(2000).required(),
  brand: Joi.string().trim().max(100).allow(""),
  price: Joi.number().positive().required(),
  stock: Joi.number().integer().min(0).default(0),
  images: Joi.array().items(Joi.string().uri().allow("")),
  category: Joi.string().hex().length(24).required(),
});

const updateProductSchema = Joi.object({
  name: Joi.string().trim().min(2).max(150),
  description: Joi.string().trim().min(5).max(2000),
  brand: Joi.string().trim().max(100).allow(""),
  price: Joi.number().positive(),
  stock: Joi.number().integer().min(0),
  images: Joi.array().items(Joi.string().uri().allow("")),
  category: Joi.string().hex().length(24),
  isActive: Joi.boolean(),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
};
