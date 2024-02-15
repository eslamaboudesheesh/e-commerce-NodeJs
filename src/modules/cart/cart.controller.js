import { StatusCodes } from "http-status-codes";
import cloudinary from "../../utils/cloud.js";
import { Category } from "../../../DB/models/category.model.js";
import slugify from "slugify";
import { SubCategory } from "../../../DB/models/subCategory.model.js";
import { Cart } from "../../../DB/models/cart.model.js";
import { Product } from "../../../DB/models/product.model.js";

export const addCart = async (req, res, next) => {
  const { productId, quantity } = req.body;
  // name slug create by image
  //check product
  const product = await Product.findById(productId);
  if (!product) return next(new Error("product not found "));

  if (quantity > product.availableItems)
    return next(
      new Error(`sorry,only ${product.availableItems} items are available  `)
    );
  //check quantity
  const cart = await Cart.findOneAndUpdate(
    {
      user: req.user._id,
    },
    { $push: { products: { productId, quantity } } },
    { new: true }
  );

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
