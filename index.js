import express from "express";
import dotenv from "dotenv";

import { connectDB } from "./DB/connection.js";
import authRouter from "./src/modules/auth/auth.router.js"


dotenv.config();
const app = express();
const port = process.env.PORT;
app.use(express.json()); // parsing req.body
await connectDB();
// user router
app.use("/auth", authRouter);



app.all("*", (req, res, next) => {
    return next(new Error("page not found !"));
});

// global error // next() invoke this middleware don't use next("route")
app.use((error, req, res, next) => {
    const statusCode = error.cause || 500;
    return res
        .status(statusCode)
        .json({ success: false, message: error.message, stack: error.stack });
});

app.listen(port, () => console.log("app is running at port", port));