import { Schema, Types, model } from "mongoose";
import { SubCategory } from "./subCategory.model.js";

const categorySchema = new Schema(
  {
    name: { type: String, required: true, min: 2, max: 12, unique: true },
    slug: { type: String, required: true, unique: true },

    img: {
      url: {
        type: String,
        required: true,
      },
      id: { type: String, required: true },
    },
    createBy: { type: Types.ObjectId, ref: "User", required: true },
    brands: [{ type: Types.ObjectId, ref: "Brand", required: true }],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

categorySchema.virtual("subcategory", {
  ref: "SubCategory",
  localField: "_id", //category
  foreignField: "category", //subcategory
});

categorySchema.post(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await SubCategory.deleteMany({
      category: this._id,
    });
  }
);

export const Category = model("Category", categorySchema);
