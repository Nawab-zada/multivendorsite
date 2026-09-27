const VendorOrder = require("../models/VendorOrder");

const createVendorOrders = async (
  vendorGroups,
  customerOrder,
  customerId,
  shippingAddress,
  paymentMethod,
  session
) => {
  const vendorOrderIds = [];

  for (const group of Object.values(vendorGroups)) {
    const items = (group.items || []).map((item) => ({
      product: item.product?._id || item.product,
      snapshot: {
        name: item.product?.name,
        image: item.product?.image,
        sku: item.product?.sku,
        brand: item.product?.brand,
        category: item.product?.category,
        slug: item.product?.slug,
        price: item.product?.price,
      },
      quantity: item.quantity,
      subtotal: item.subtotal,
    }));

    const vendorOrder = await VendorOrder.create(
      [
        {
          customerOrder: customerOrder?._id || customerOrder,
          vendor: group.vendor,
          customer: customerId,
          items,
          shippingAddress,
          paymentMethod,
          subtotal: group.subtotal,
          shippingFee: 0,
          totalAmount: group.subtotal,
          paymentStatus: "pending",
          orderStatus: "pending",
        },
      ],
      { session }
    );

    vendorOrderIds.push(vendorOrder[0]._id);
  }

  return vendorOrderIds;
};

module.exports = createVendorOrders;
