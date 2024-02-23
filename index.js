import express from "express";
import dotenv from "dotenv";

import { connectDB } from "./DB/connection.js";
import authRouter from "./src/modules/auth/auth.router.js";
import categoryRouter from "./src/modules/category/category.router.js";
import subcategoryRouter from "./src/modules/subCategory/subCategory.router.js";
import brandRouter from "./src/modules/brand/brand.router.js";
import couponRouter from "./src/modules/coupon/coupon.router.js";
import morgan from "morgan";

dotenv.config();

const app = express();
const port = process.env.PORT;
await connectDB();
//cors
const whiteList = ["http://127.0.0.1:5500"];
app.use(morgan("combined"));
app.use(express.json()); // parsing req.body
app.use((req, res, next) => {
  if (req.originalUrl.includes("/auth/activate_account")) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    return next();
  }
  if (!whiteList.includes(req.header("origin"))) {
    return next(new Error("Blocked By CORS!"));
  }
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Private-Network", true);
  return next();
});
// user router
app.use("/auth", authRouter);
app.use("/category", categoryRouter);
app.use("/subCategory", subcategoryRouter);
app.use("/brand", brandRouter);
app.use("/coupon", couponRouter);

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
