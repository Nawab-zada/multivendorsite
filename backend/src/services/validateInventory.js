const Product = require("../models/Product");

const validateInventory = async (cart, session = null) => {
  const cartItems = Array.isArray(cart?.items) ? cart.items : [];

  for (const item of cartItems) {
    const productId = item.product?._id || item.product;
    const quantity = Number(item.quantity) || 0;

    if (!productId || quantity <= 0) continue;

    const query = Product.findById(productId);
    const product = session ? await query.session(session) : await query;

    if (!product) {
      throw {
        status: 404,
        message: `${item.product?.name || "Item"} no longer exists`,
      };
    }

    if (!product.isActive) {
      throw {
        status: 400,
        message: `${product.name} is unavailable`,
      };
    }

    if (product.stock < quantity) {
      throw {
        status: 400,
        message: `${product.name} has insufficient stock`,
      };
    }
  }
};

module.exports = validateInventory;
