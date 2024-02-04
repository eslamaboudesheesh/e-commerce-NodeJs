import jwt from "jsonwebtoken"
import { User } from "../../DB/models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Token } from "../../DB/models/token.model.js";

export const isAuth = asyncHandler(async (req, res, next) => {
    // check token
    let { token } = req.headers
    if (!token) return next(new Error("token is required", { cause: 400 }))
    // check prefix 
    if (!token.startsWith("Route_"))
        return next(new Error("invalid bearer key", { cause: 401 }))

    // split 
    token = token.split("Route_")[1]
    // payload .. decoding  {id ,email}


    //check if token isValid 

    const tokenDB = await Token.findOne({ token, isValid: true })
    if (!tokenDB) return next(new Error("token Expired !", { cause: 401 }))
    const payload = jwt.verify(token, "secretKey");

    //check user 

    const user = await User.findById(payload.id)
    if (!user) return next(new Error("user not found !", { cause: 404 }))
    // pass user data to the next controller
    req.user = user
    //call next controller
    return next()
})