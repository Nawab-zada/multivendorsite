const Product = require("../models/Product");

const updateInventory = async (cart, session) => {
  for (const item of cart.items || []) {
    const productId = item.product?._id || item.product;
    const quantity = Number(item.quantity) || 0;

    if (!productId || quantity <= 0) continue;

    const updatedProduct = await Product.findOneAndUpdate(
      {
        _id: productId,
        stock: { $gte: quantity },
      },
      {
        $inc: {
          stock: -quantity,
        },
      },
      {
        new: true,
        session,
      }
    );

    if (!updatedProduct) {
      const productName = item.product?.name || "Item";
      throw new Error(`${productName} is out of stock`);
    }
  }
};

module.exports = updateInventory;
