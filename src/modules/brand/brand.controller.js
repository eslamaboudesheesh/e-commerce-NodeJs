import slugify from "slugify";
import { Brand } from "../../../DB/models/brand.model.js";
import { Category } from "../../../DB/models/category.model.js";

export const addBrand = async (req, res, next) => {
  const { categories, name } = req.body;

  categories.forEach(async (id) => {
    const categoryData = await Category.findById({ _id: id });

    if (!categoryData) {
      return next(
        new Error(`category  ${id} not found`, { cause: StatusCodes.NOT_FOUND })
      );
    }
  });

  if (!req.file)
    return next(
      new Error("brand image is required", { cause: StatusCodes.NOT_FOUND })
    );

  // upload file to cloudinary
  const { public_id, secure_url } = await cloudinary.uploader.upload({
    folder: `${process.env.CLOUD_FOLDER_NAME}/brands`,
  });

  const brand = await Brand.create({
    name: name,
    slug: slugify(req.body.name, "_"),
    createBy: req.user._id,
    image: { id: public_id, url: secure_url },
  });
  //save brand in each category
  categories.forEach(async (id) => {
    await Category.findByIdAndUpdate(id, {
      $push: { brands: brand._id },
    });
  });
  //return response
  return res
    .status(StatusCodes.CREATED)
    .json({ success: true, message: "Brand add successfully  " });
};

export const updateBrand = async (req, res, next) => {
  const { id } = req.params;

  const brandData = await Brand.findById({ _id: id });

  if (!brandData) {
    return next(new Error("brand not found", { cause: StatusCodes.NOT_FOUND }));
  }

  // upload file to cloudinary
  if (req.file) {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      { public_id: brandData.img.id }
    );
    brandData.img = { id: public_id, url: secure_url };
  }

  if (req.user._id.toString() !== brandData.createBy.toString()) {
    return next(
      new Error("Unauthorized: You are not the owner of this brand.", {
        cause: StatusCodes.UNAUTHORIZED,
      })
    );
  }

  // update

  brandData.name = req.body.name ? req.body.name : brandData.name;
  brandData.slug = req.body.name ? slugify(req.body.name) : brandData.slug;

  await brandData.save();

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "brand updated successfully",
    data: categoryUpdate,
  });
};

export const deleteBrand = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user._id;

  const brand = await Brand.findById({ _id: id });

  if (!brand) {
    return next(new Error("brand not found", { cause: StatusCodes.NOT_FOUND }));
  }

  if (userId.toString() !== brand.createBy.toString()) {
    return next(
      new Error("Unauthorized: You are not the owner of this brand.", {
        cause: StatusCodes.UNAUTHORIZED,
      })
    );
  }
  const data = await Brand.findByIdAndDelete({
    _id: id,
  });

  await cloudinary.uploader.destroy(brand.img.id);

  await Category.updateMany({}, { $pull: { brands: id } });

  return res.status(StatusCodes.OK).json({
    success: true,
    message: "brand deleted successfully",
    data: data,
  });
};

export const allBrand = async (req, res, next) => {
  const all = await Brand.find();
  return res.status(StatusCodes.OK).json({ success: true, data: all });
};
