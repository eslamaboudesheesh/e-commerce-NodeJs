import { StatusCodes } from "http-status-codes";
import cloudinary from "../../utils/cloud.js";
import { Category } from "../../../DB/models/category.model.js";
import slugify from "slugify";

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
