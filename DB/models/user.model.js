import { Schema, model } from "mongoose";

const userSchema = new Schema(
    {
        username: { type: String, required: true, min: 3, max: 20 },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true },
        isConfirmed: { type: Boolean, default: false },
        gender: {
            type: String, enum: ["male", "female"]
        },
        phone: {
            type: String,
        },
        role: {
            type: String, enum: ["user", "seller"],
            default: "user"
        },
        forgetCode: String,
        profileImage: {
            url: { type: String, default: "https://res.cloudinary.com/decdowykp/image/upload/v1706888990/samples/ecommerce/user/default/nonImg_bskkrq.png" }, id: { type: String, default: "ecommerce/user/default/nonImg_bskkrq" }
        },
        coverImages: [{ url: { type: String }, id: { type: String } }]

    },
    { timestamps: true }
);

export const User = model("User", userSchema);
