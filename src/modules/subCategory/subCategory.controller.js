import { StatusCodes } from "http-status-codes";
import cloudinary from "../../utils/cloud.js";
import { Category } from "../../../DB/models/category.model.js";
import slugify from "slugify";
import { SubCategory } from "../../../DB/models/subCategory.model.js";

export const addSubCategory = async (req, res, next) => {
  // name slug create by image
  //check file is required
  const category = await Category.findById(req.params.category);
  if (!category) return next(new Error("category not found"));
  if (!req.file)
    return next(
      new Error("subcategory image is required", {
        cause: StatusCodes.NOT_FOUND,
      })
    );

  // upload file to cloudinary
  const { public_id, secure_url } = await cloudinary.uploader.upload({
    folder: `${process.env.CLOUD_FOLDER_NAME}/subcategory`,
  });

  await SubCategory.create({
    name: req.body.name,
    slug: slugify(req.body.name, "_"),
    createBy: req.user._id,
    image: { id: public_id, url: secure_url },
    category: req.params.category,
  });
  //return response
  return res
    .status(StatusCodes.CREATED)
    .json({ success: true, message: "subcategory add successfully  " });
};

export const updateSubCategory = async (req, res, next) => {
  const { category, id } = req.params;

  const categoryData = await Category.findById({ _id: category });

  if (!categoryData) {
    return next(
      new Error("category not found", { cause: StatusCodes.NOT_FOUND })
    );
  }

  const subcategory = await SubCategory.findOne({
    _id: id,
    category: category,
  });

  if (!subcategory) {
    return next(
      new Error("subcategory not found", { cause: StatusCodes.NOT_FOUND })
    );
  }

  if (req.user._id.toString() !== subcategory.createBy.toString()) {
    return next(
      new Error("Unauthorized: You are not the owner of this subcategory.", {
        cause: StatusCodes.UNAUTHORIZED,
      })
    );
  }

  // upload file to cloudinary
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { public_id: subcategory.img.id }
    );
    subcategory.img = { id: public_id, url: secure_url };
  }

  // update

  subcategory.name = req.body.name ? req.body.name : subcategory.name;
  subcategory.slug = req.body.name ? slugify(req.body.name) : subcategory.slug;

  await subcategory.save();

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "subcategory updated successfully",
    data: categoryUpdate,
  });
};

export const deleteSubCategory = async (req, res, next) => {
  const { id, category } = req.params;
  const userId = req.user._id;

  const categoryData = await Category.findById({ _id: category });

  if (!categoryData) {
    return next(
      new Error("category not found", { cause: StatusCodes.NOT_FOUND })
    );
  }

  const subcategory = await SubCategory.findOne({
    _id: id,
    category: category,
  });

  if (!subcategory) {
    return next(
      new Error("subcategory not found", { cause: StatusCodes.NOT_FOUND })
    );
  }

  if (userId.toString() !== subcategory.createBy.toString()) {
    return next(
      new Error("Unauthorized: You are not the owner of this subcategory.", {
        cause: StatusCodes.UNAUTHORIZED,
      })
    );
  }

  const data = await SubCategory.findByIdAndDelete({
    _id: id,
  });

  await cloudinary.uploader.destroy(subcategory.img.id);
  return res.status(StatusCodes.OK).json({
    success: true,
    message: "subcategory deleted successfully",
    data: data,
  });
};

export const allSubCategory = async (req, res, next) => {
  const { category } = req.params;

  if (category) {
    const categoryData = await Category.findById({ _id: category });

    if (!categoryData) {
      return next(
        new Error("category not found", { cause: StatusCodes.NOT_FOUND })
      );
    }
  }
  if (category) {
    const all = await SubCategory.find({ category: category });
    return res.status(StatusCodes.OK).json({ success: true, data: all });
  }
  const all = await SubCategory.find().populate([
    { path: "category", populate: [{ path: "createBy", select: "email" }] },
  ]);
  return res.status(StatusCodes.OK).json({ success: true, data: all });
};
