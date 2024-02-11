import { Schema, Types, model } from "mongoose";

const SubCategorySchema = new Schema(
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
    category: { type: Types.ObjectId, ref: "Category", required: true },
    brands: [{ type: Types.ObjectId, ref: "Brand", required: true }],
  },
  { timestamps: true }
);

export const SubCategory = model("SubCategory", SubCategorySchema);
