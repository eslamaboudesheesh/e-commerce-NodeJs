import { Schema, Types, model } from "mongoose";

const brandSchema = new Schema(
  {
    name: { type: String, required: true, min: 2, max: 12, unique: true },
    slug: { type: String, required: true, unique: true },

    img: {
      url: {
        type: String,
        require: true,
      },
      id: { type: String, require: true },
    },
    createBy: { type: Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const Brand = model("Brand", brandSchema);
