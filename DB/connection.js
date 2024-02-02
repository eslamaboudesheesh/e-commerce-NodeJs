import mongoose from "mongoose";

export const connectDB = async () => {
    return await mongoose
        .connect(process.env.CONNECTION_URL)
        .then((e) => console.log("db Run"))
        .catch((error) => console.log(error));
};
