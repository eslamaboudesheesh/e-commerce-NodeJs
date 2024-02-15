import { StatusCodes } from "http-status-codes";
import cloudinary from "../../utils/cloud.js";
import { Category } from "../../../DB/models/category.model.js";
import slugify from "slugify";
import { SubCategory } from "../../../DB/models/subCategory.model.js";
import { Cart } from "../../../DB/models/cart.model.js";
import { Product } from "../../../DB/models/product.model.js";
import { Coupon } from "../../../DB/models/coupon.model.js";
import { Order } from "../../../DB/models/order.model.js";
import createInvoice from "../../utils/pdfInvoice.js";

export const addCart = async (req, res, next) => {
  const { phone, address, payment, coupon } = req.body;
  // name slug create by image
  //check coupon
  let checkCoupon;

  if (coupon) {
    checkCoupon = await Coupon.findOne({
      name: coupon,
      expiredAt: { $gt: Date.now() },
    });
  }

  if (!checkCoupon) return next(new Error("coupon not found "));
  // get products from cart
  const cart = await Cart.findOne({ user: req.user._id });

  const products = cart.products;
  if (products.length < 1) return next(new Error("products not found "));

  //check products

  let orderProducts = [];
  let orderPrice = 0;

  for (let i = 0; i < products.length; i++) {
    const product = await Product.findById(products[i].productId);
    if (!product) return next(new Error(`${products[i].productId} not found `));

    if (!product.inStock(products[i].quantity))
      return next(new Error(`${products[i].productId} out of stock `));

    orderProducts.push({
      name: product.name,
      quantity: products[i].quantity,
      itemPrice: product.finalPrice,
      totalPrice: product.finalPrice * products[i].quantity,
      productId: product._id,
    });

    orderPrice += product.finalPrice * products[i].quantity;
  }
  // create order in DB
  const order = Order.create({
    user: req.user._id,
    address,
    phone,
    payment,
    products: orderProducts,
    price: orderPrice,
    coupon: {
      id: checkCoupon?._id,
      name: checkCoupon?.name,
      discount: checkCoupon?.discount,
    },
  });
  // create invoice
  const user = req.user;
  const invoice = {
    shipping: {
      name: user.userName,
      address: order.address,
      country: "Egypt",
    },
    items: orderProducts,
    subtotal: order.price,
    paid: order.finalPrice,
    invoice_nr: order._id,
  };
  createInvoice(invoice, ` ${order._id} invoice.pdf`);
  // upload cloud
  // add to DB  file  URL ,ID

  // send email to user invoices
  // update stock

  // clear cart

  //return response
  return res
    .status(StatusCodes.CREATED)
    .json({ success: true, message: "cart add successfully  ", result: cart });
};

export const updateCart = async (req, res, next) => {
  const { productId, quantity } = req.params;

  const product = await Product.findById(productId);
  if (!product) return next(new Error("product not found "));

  if (!product.inStock(quantity))
    return next(
      new Error(`sorry,only ${product.availableItems} items are available  `)
    );

  const cart = await Cart.findOneAndUpdate(
    {
      user: req.user._id,
      "products.productId": productId,
    },
    { "products.$.quantity": quantity },
    { new: true }
  );

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "cart updated successfully",
    data: cart,
  });
};

export const removeCart = async (req, res, next) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) return next(new Error("product not found "));

  const cart = await Cart.findOneAndUpdate(
    {
      user: req.user._id,
    },
    { $pull: { products: { productId } } },
    { new: true }
  );

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "product remove  successfully",
    data: cart,
  });
};

export const deleteCart = async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    {
      user: req.user._id,
    },
    { products: [] },
    { new: true }
  );

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "all products remove  successfully",
    data: cart,
  });
};

export const userCart = async (req, res, next) => {
  if (req.user.role == "user") {
    const all = await Cart.findOne({ user: req.user._id });
    return res.status(StatusCodes.OK).json({ success: true, data: all });
  }
  const { cartId } = req.body;
  if (req.user.role == "admin" && !cartId)
    return next(new Error("cart id required "));

  const all = await Cart.findById(cartId);
  return res.status(StatusCodes.OK).json({ success: true, data: all });
};
