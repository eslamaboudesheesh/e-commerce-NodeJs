import { StatusCodes } from "http-status-codes";
import { Product } from "../../../DB/models/product.model.js";
import { Order } from "../../../DB/models/order.model.js";
import { Review } from "../../../DB/models/review.model.js";

export const addReview = async (req, res, next) => {
  const { productId } = req.params;
  const { comment, rating } = req.body;
  //check order
  const order = await Order.findOne({
    user: req.user._id,
    status: "delivered",
    "products.productId": productId,
  });
  if (!order) return next(new Error("order not found "));

  //check past review
  if (
    await Review.findOne({
      createBy: req.user._id,
      productId,
      order: order._id,
    })
  )
    return next(new Error("order Already reviewed "));

  //check quantity
  const review = await Review.findOne({
    comment,
    rating,
    createBy: req.user._id,
    order: order._id,
    productId,
  });
  // calculate average rate
  let calculateRating = 0;
  const product = await Product.findById(productId);
  const reviews = await Review.find({ productId });

  for (let i = 0; i < reviews.length; i++) {
    calculateRating += reviews[i].rating;
  }
  product.averageRate = calculateRating / reviews.length;
  await product.save();
  //return response
  return res.status(StatusCodes.CREATED).json({
    success: true,
    message: "review add successfully  ",
    result: review,
  });
};

export const updateReview = async (req, res, next) => {
  const { productId, id } = req.params;

  const review = await Review.updateOne(
    { _id: id, productId },
    { ...req.body }
  );

  let calculateRating = 0;
  const product = await Product.findById(productId);
  const reviews = await Review.find({ productId });

  for (let i = 0; i < reviews.length; i++) {
    calculateRating += reviews[i].rating;
  }
  product.averageRate = calculateRating / reviews.length;
  await product.save();

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "Review updated successfully",
    data: review,
  });
};
