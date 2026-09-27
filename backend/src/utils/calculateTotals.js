const calculateTotals = (orderItems, shippingFee = 0, tax = 0) => {
  const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
  const totalAmount = subtotal + shippingFee + tax;

  return { subtotal, shippingFee, tax, totalAmount };
};

module.exports = calculateTotals;
