import { Schema, Types, model } from "mongoose";

const orderSchema = new Schema(
  {
    products: [
      {
        productId: { type: Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
        itemPrice: Number,
        totalPrice: Number,
        name: String,
      },
    ],
    address: { type: String, required: true },
    payment: { type: String, default: "cash", enum: ["cash", "visa"] },
    phone: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    invoice: {
      url: {
        type: String,
      },
      id: { type: String },
    },
    coupon: {
      id: { type: Types.ObjectId, ref: "Coupon" },
      name: String,
      discount: { type: Number, min: 1, max: 100 },
    },
    status: {
      type: String,
      default: "placed",
      enum: ["placed", "shipped", "delivered", "canceled", "refunded"],
    },
    user: { type: Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

orderSchema.virtual("finalPrice").get(function () {
  return this.coupon
    ? Number.parseFloat(
        this.price - (this.price * this.coupon.discount || 0) / 100
      ).toFixed(2)
    : this.price;
});
export const Order = model("Order", orderSchema);
