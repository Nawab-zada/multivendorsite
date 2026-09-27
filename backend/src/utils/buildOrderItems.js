const Product = require("../models/Product");

const buildOrderItems = async (cartItems, session = null) => {
  const orderItems = [];

  for (const item of cartItems) {
    const query = Product.findById(item.product._id);
    const product = session ? await query.session(session) : await query;

    orderItems.push({
      product: product._id,
      vendor: product.vendor,
      name: product.name,
      image: product.images[0] || "",
      price: product.price,
      quantity: item.quantity,
      subtotal: product.price * item.quantity,
    });
  }

  return orderItems;
};

module.exports = buildOrderItems;
