const Joi = require("joi");

const createOrderSchema = Joi.object({
  shippingAddress: Joi.object({
    fullName: Joi.string().trim().required(),
    phone: Joi.string().trim().required(),
    country: Joi.string().trim().required(),
    province: Joi.string().trim().required(),
    city: Joi.string().trim().required(),
    address: Joi.string().trim().required(),
    postalCode: Joi.string().trim().required(),
  }).required(),
  paymentMethod: Joi.string().valid("COD", "Stripe", "JazzCash", "EasyPaisa").default("COD"),
  shippingFee: Joi.number().min(0).default(0),
  tax: Joi.number().min(0).default(0),
});

module.exports = {
  createOrderSchema,
};
