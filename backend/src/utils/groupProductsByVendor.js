const groupProductsByVendor = (cart = {}) => {
  const vendorGroups = {};
  const items = Array.isArray(cart.items) ? cart.items : [];

  for (const item of items) {
    const vendorId = item.vendor?.toString();

    if (!vendorId) continue;

    if (!vendorGroups[vendorId]) {
      vendorGroups[vendorId] = {
        vendor: vendorId,
        items: [],
        subtotal: 0,
      };
    }

    vendorGroups[vendorId].items.push(item);
    vendorGroups[vendorId].subtotal += Number(item.subtotal) || 0;
  }

  return vendorGroups;
};

module.exports = groupProductsByVendor;
