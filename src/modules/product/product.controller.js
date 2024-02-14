import slugify from "slugify";
import { Brand } from "../../../DB/models/brand.model.js";
import { Category } from "../../../DB/models/category.model.js";
import { Coupon } from "../../../DB/models/coupon.model.js";
import { nanoid } from "nanoid";
import { Product } from "../../../DB/models/product.model.js";
import cloudinary from "../../utils/cloud.js";
import { StatusCodes } from "http-status-codes";
import { SubCategory } from "../../../DB/models/subCategory.model.js";

export const addProduct = async (req, res, next) => {
  //check category
  const { category, subCategory, brand } = req.params;

  const categoryItem = await Category.findById({ _id: category });

  if (!categoryItem) {
    return next(
      new Error("category not found", { cause: StatusCodes.NOT_FOUND })
    );
  }
  //check  sub category
  const subCategoryItem = await subCategory.findById({ _id: subCategory });

  if (!subCategoryItem) {
    return next(
      new Error("sub category not found", { cause: StatusCodes.NOT_FOUND })
    );
  }
  //check brand category
  const brandItem = await Brand.findById({ _id: brand });

  if (!brandItem) {
    return next(new Error("brand not found", { cause: StatusCodes.NOT_FOUND }));
  }

  if (!req.files)
    return next(
      new Error("category image is required", { cause: StatusCodes.NOT_FOUND })
    );

  //create folder

  const cloudFolder = nanoid();

  let images = [];
  for (const file of req.files.subImages) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      file.path,
      { folder: `${process.env.CLOUD_FOLDER_NAME}/products/${cloudFolder}` }
    );
    images.push({ id: public_id, url: secure_url });
  }

  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.files.defaultImage[0].path,
    { folder: `${process.env.CLOUD_FOLDER_NAME}/products/${cloudFolder}` }
  );

  const product = Product.create({
    ...req.body,
    cloudFolder,
    defaultImage: { id: public_id, url: secure_url },
    images,
    createdBy: req.user._id,
  });

  return res
    .status(StatusCodes.CREATED)
    .json({ success: true, message: "product add successfully  " });
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

export const deleteProduct = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  const product = await Product.findOne({ _id: id });

  if (!product) {
    return next(
      new Error("product not found", { cause: StatusCodes.NOT_FOUND })
    );
  }

  if (userId !== product.createdBy.toString()) {
    return next(
      new Error("Unauthorized: You are not the owner of this product.", {
        cause: StatusCodes.UNAUTHORIZED,
      })
    );
  }
  await product.deleteOne();

  //delete image in cloudinary multi image
  const ids = product.images.map((e) => e.id);
  ids.push(product.defaultImage.id);
  await cloudinary.api.delete_all_resources(ids);

  await cloudinary.api.delete_folder(
    `${process.env.CLOUD_FOLDER_NAME}/products/${product.cloudFolder}`
  );
  return res.status(StatusCodes.OK).json({
    success: true,
    message: "product deleted successfully",
  });
};

export const allProduct = async (req, res, next) => {
  //search
  const { page, sort, keyword, category, brand, subCategory } = req.query;

  if (category && !(await Category.findById(category))) {
    return next(
      new Error("category not found", { cause: StatusCodes.NOT_FOUND })
    );
  }

  if (subCategory && !(await SubCategory.findById(category))) {
    return next(
      new Error("category not found", { cause: StatusCodes.NOT_FOUND })
    );
  }

  if (brand && !(await Brand.findById(category))) {
    return next(
      new Error("category not found", { cause: StatusCodes.NOT_FOUND })
    );
  }
  //filter
  //sort
  //pagination

  // const result = await Product.find({
  //   name: { $regex: keyword, $option: "i" },
  // });

  // const result = await Product.find({
  //   ...req.query,
  // }).sort();

  // pagination >> skip() limit( )
  // page = page < 1 || isNaN(page) || !page ? 1 : page;
  // const limit = 1;
  // const skip = limit * (page - 1);
  // const result = await Product.find({}).skip(skip).limit(limit);

  const result = await Product.find({ ...req.query })
    .sort(sort)
    .paginate(page)
    .search(keyword);
  return res.status(StatusCodes.OK).json({ success: true, data: result });
};
