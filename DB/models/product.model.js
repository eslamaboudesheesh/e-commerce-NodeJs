import { Schema, Types, model } from "mongoose";

const productSchema = new Schema(
  {
    name: { type: String, required: true, min: 2, max: 12, unique: true },
    description: { type: String, min: 10, max: 200 },
    images: [
      {
        url: {
          type: String,
          require: true,
        },
        id: { type: String, require: true },
      },
    ],
    defaultImage: {
      url: {
        type: String,
        require: true,
      },
      id: { type: String, require: true },
    },
    availableItems: { type: Number, min: 1, require: true },
    soldItems: { type: Number, default: 0 },
    price: { type: Number, min: 1, require: true },
    discount: { type: Number, min: 1, max: 100 },

    createBy: { type: Types.ObjectId, ref: "User" },
    category: { type: Types.ObjectId, ref: "Category", required: true },
    subCategory: { type: Types.ObjectId, ref: "SubCategory", required: true },
    brand: { type: Types.ObjectId, ref: "Brand", required: true },

    cloudFolder: { type: String, require: true, unique: true },
  },
  {
    timestamps: true,
    strictQuery: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual("finalPrice").get(function () {
  return Number.parseFloat(
    this.price - (this.price * this.discount || 0) / 100
  ).toFixed(2);
});
// query helper
productSchema.query.paginate = function (page) {
  page = page < 1 || isNaN(page) || !page ? 1 : page;
  const limit = 1;
  const skip = limit * (page - 1);
  return this.skip(skip).limit(limit);
};
// query helper search
productSchema.query.search = function (keyword) {
  if (keyword) {
    return this.find({
      name: { $regex: keyword, $option: "i" },
    });
  }
};
export const Product = model("Product", productSchema);
