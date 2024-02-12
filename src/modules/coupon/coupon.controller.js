import slugify from "slugify";
import { Brand } from "../../../DB/models/brand.model.js";
import { Category } from "../../../DB/models/category.model.js";
import voucher_codes from "voucher-code-generator";
import { Coupon } from "../../../DB/models/coupon.model.js";

export const addCoupon = async (req, res, next) => {
  const { discount, expiredAt } = req.body;
  const code = voucher_codes.generate({
    length: 5,
  }); // []

  const coupon = await Coupon.create({
    name: code[0],
    createdBy: req.user._id,
    expiredAt: new Data(expiredAt).getTime(),
    discount: discount,
  });

  return res
    .status(StatusCodes.CREATED)
    .json({ success: true, message: "coupon add successfully  " });
};

export const updateCoupon = async (req, res, next) => {
  const { code } = req.params;

  const coupon = await Coupon.findOne({
    name: code,
    expiredAt: { $gt: Date.now() },
  });

  if (!coupon) {
    return next(
      new Error("coupon not found", { cause: StatusCodes.NOT_FOUND })
    );
  }

  if (req.user.id !== coupon.createdBy.toString()) {
    return next(
      new Error("Unauthorized: You are not the owner of this coupon.", {
        cause: StatusCodes.UNAUTHORIZED,
      })
    );
  }

  // update

  coupon.discount = req.body.discount ? req.body.discount : coupon.discount;
  coupon.expiredAt = req.body.expiredAt
    ? new Date(req.body.expiredAt).getTime()
    : coupon.expiredAt;

  await coupon.save();

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "coupon updated successfully",
    data: coupon,
  });
};

export const deleteCoupon = async (req, res, next) => {
  const { code } = req.params;
  const userId = req.user.id;

  const coupon = await Coupon.findOne({ name: code });

  if (!coupon) {
    return next(
      new Error("coupon not found", { cause: StatusCodes.NOT_FOUND })
    );
  }

  if (userId.toString() !== coupon.createdBy.toString()) {
    return next(
      new Error("Unauthorized: You are not the owner of this coupon.", {
        cause: StatusCodes.UNAUTHORIZED,
      })
    );
  }
  await coupon.deleteOne();

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "coupon deleted successfully",
  });
};

export const allCoupon = async (req, res, next) => {
  if (req.user.role === "admin") {
    const all = await Coupon.find();
    return res.status(StatusCodes.OK).json({ success: true, data: all });
  }
  const all = await Coupon.find({ createdBy: req.user._id });
  return res.status(StatusCodes.OK).json({ success: true, data: all });
};
