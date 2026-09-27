const Product = require("../models/Product");

const validateInventory = async (cartItems, session = null) => {
  for (const item of cartItems) {
    const query = Product.findById(item.product._id);
    const product = session ? await query.session(session) : await query;

    if (!product) {
      throw {
        status: 404,
        message: `${item.product.name} no longer exists`,
      };
    }

    if (!product.isActive) {
      throw { status: 400, message: `${product.name} is unavailable` };
    }

    if (product.stock < item.quantity) {
      throw {
        status: 400,
        message: `${product.name} has insufficient stock`,
      };
    }
  }
};

module.exports = validateInventory;
