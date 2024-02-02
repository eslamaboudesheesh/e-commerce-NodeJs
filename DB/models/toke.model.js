import { Schema, Types, model } from "mongoose";

const tokenSchema = new Schema({
    token: { type: String, require: true },
    isValid: { type: Boolean, default: true },
    agent: { type: String }, //device 
    expiredAt: { type: String },
    user: {
        type: Types.ObjectId,
        ref: "User"
    },
}, { timestamps: true }
)

export const Token = model("Token", tokenSchema)