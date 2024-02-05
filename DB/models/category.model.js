import { Schema, Types, model } from "mongoose";

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
  },
  { timestamps: true }
);

export const Category = model("Category", categorySchema);
