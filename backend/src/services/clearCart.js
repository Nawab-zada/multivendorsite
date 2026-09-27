const clearCart = async (cart, session) => {
  if (!cart) return;

  cart.items = [];
  cart.totalItems = 0;
  cart.totalAmount = 0;

  await cart.save({ session });
};

module.exports = clearCart;
