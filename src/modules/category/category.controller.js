import { StatusCodes } from "http-status-codes";
import cloudinary from "../../utils/cloud.js";
import { Category } from "../../../DB/models/category.model.js";
import slugify from "slugify";
import { SubCategory } from "../../../DB/models/subCategory.model.js";

export const addCategory = async (req, res, next) => {
  // name slug create by image
  //check file is required

  if (!req.file)
    return next(
      new Error("category image is required", { cause: StatusCodes.NOT_FOUND })
    );

  // upload file to cloudinary
  const { public_id, secure_url } = await cloudinary.uploader.upload({
    folder: `${process.env.CLOUD_FOLDER_NAME}/category`,
  });

  await Category.create({
    name: req.body.name,
    slug: slugify(req.body.name, "_"),
    createBy: req.user._id,
    image: { id: public_id, url: secure_url },
  });
  //return response
  return res
    .status(StatusCodes.CREATED)
    .json({ success: true, message: "Category add successfully  " });
};

export const updateCategory = async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findById({ _id: id });

  if (!category) {
    return next(
      new Error("category not found", { cause: StatusCodes.NOT_FOUND })
    );
  }

  if (req.user._id.toString() !== category.createBy.toString()) {
    return next(
      new Error("Unauthorized: You are not the owner of this category.", {
        cause: StatusCodes.UNAUTHORIZED,
      })
    );
  }

  // upload file to cloudinary
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { public_id: category.img.id }
    );
    category.img = { id: public_id, url: secure_url };
  }

  // update

  category.name = req.body.name ? req.body.name : category.name;
  category.slug = req.body.name ? slugify(req.body.name) : category.slug;

  await category.save();

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "category updated successfully",
    data: categoryUpdate,
  });
};

export const deleteCategory = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const category = await Category.findById({ _id: id });

  if (!category) {
    return next(
      new Error("category not found", { cause: StatusCodes.NOT_FOUND })
    );
  }

  if (userId.toString() !== category.createBy.toString()) {
    return next(
      new Error("Unauthorized: You are not the owner of this category.", {
        cause: StatusCodes.UNAUTHORIZED,
      })
    );
  }

  await category.deleteOne();

  await cloudinary.uploader.destroy(category.img.id);
  return res.status(StatusCodes.OK).json({
    success: true,
    message: "job deleted successfully",
    data: data,
  });
};

export const allCategory = async (req, res, next) => {
  const all = await Category.find().populate("subcategory");
  return res.status(StatusCodes.OK).json({ success: true, data: all });
};
