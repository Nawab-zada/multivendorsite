const Joi = require("joi");

const addToCartSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).default(1),
});

const updateCartQuantitySchema = Joi.object({
  quantity: Joi.number().integer().min(1).required(),
});

module.exports = {
  addToCartSchema,
  updateCartQuantitySchema,
};
