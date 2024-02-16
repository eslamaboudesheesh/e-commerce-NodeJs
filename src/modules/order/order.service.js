import { Cart } from "../../../DB/models/cart.model";
import { Product } from "../../../DB/models/product.model";

export const updateStock = async (products) => {
  for (const product of products) {
    await Product.findByIdAndUpdate(product.productId, {
      $inc: {
        soldItems: product.quantity,
        availableItems: -product.quantity,
      },
    });
  }
};

export const clearCart = async (userId) => {
  await Cart.findByIdAndUpdate(
    { user: userId },
    {
      products: [],
    }
  );
};
