import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { StatusCodes } from "http-status-codes";
import Randomstring from "randomstring";

import { User } from "../../../DB/models/user.model.js";
import sendEmail from "../../utils/sendEmail.js";
import { signUpTemp } from "../../utils/htmlTempletes.js";
import { Token } from "../../../DB/models/toke.model.js";

export const register = async (req, res, next) => {
  const { userName, email, password } = req.body;
  const userExist = await User.findOne({ email });
  if (userExist)
    return next(
      new Error("user already exist", { cause: StatusCodes.CONFLICT })
    );
  // hash password  8 or 10 to bes secure and good performance
  const hashPassword = bcryptjs.hashSync(password, process.env.SALT_ROUND);

  // generate token
  const token = jwt.sign({ email }, process.env.TOKEN_SECRET);
  const user = await User.create({
    userName,
    email,
    password: hashPassword,
  });
  // confirmation link
  const confirmLink = `http://localhost:3000/auth/activate_account/${token}`;

  // send email

  const messageSent = await sendEmail({
    to: email,
    subject: "activate Account ",
    html: signUpTemp(confirmLink),
  });
  if (!messageSent)
    return next(new Error("error when send the email try again"));
  return res
    .status(StatusCodes.CREATED)
    .json({ success: true, message: "user add successfully  " });
};

export const activateAccount = async (req, res, next) => {
  const { token } = req.params;
  const { email } = jwt.verify(token, process.env.TOKEN_SECRET);

  // find user

  const userExist = await User.findOneAndUpdate(
    { email },
    { isConfirmed: true }
  );
  if (!userExist)
    return next(new Error("user Not exist", { cause: StatusCodes.NOT_FOUND }));
  // create a cart //TODO

  return res
    .status(StatusCodes.ACCEPTED)
    .json({ success: true, message: "try to login  " });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    email,
  });

  if (!user) {
    return next(new Error("User not found"), { cause: StatusCodes.NOT_FOUND });
  }
  if (!user.isConfirmed) {
    return next(new Error("User not confirmed activate your account"));
  }
  const match = bcryptjs.compareSync(password, user.password);
  if (!match) {
    return next(new Error("Incorrect password"), {
      cause: StatusCodes.UNAUTHORIZED,
    });
  }

  //  token
  const token = jwt.sign({ id: user._id, email }, process.env.TOKEN_SECRET);
  //save token in token model
  await Token.create({
    token,
    user: user._id,
    agent: req.headers["user-agent"],
  });

  return res
    .status(StatusCodes.OK)
    .json({ success: true, message: `welcome ${user.username} `, token });
};

export const sendForgetCode = async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error("User not found"), { cause: StatusCodes.NOT_FOUND });
  }

  // generate code

  const randomString = Randomstring.generate({
    length: 5,
    charset: "numeric",
  });

  //save code in deb
  user.forgetCode = randomString;
  await user.save();
  //send email
  const messageSent = await sendEmail({
    to: user.email,
    subject: "activate Code",
    html: `<div>${randomString} </div>`,
  });

  if (!messageSent) return next(new Error("Email Invalid ! "));

  return res
    .status(StatusCodes.OK)
    .json({ success: true, message: "code send Successfully" });
};

export const resetPassWord = async (req, res, next) => {
  const { email, password, code } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return next(new Error("User not found"), { cause: StatusCodes.NOT_FOUND });
  }
  if (user.forgetCode !== code) {
    return next(new Error("invalid code"), { cause: StatusCodes.NOT_FOUND });
  }
  await User.findOneAndUpdate({ email: email }, { $unset: { forgetCode: 1 } });

  user.password = bcryptjs.hashSync(password, process.env.SALT_ROUND);
  await user.save();

  const tokens = await Token.find({ user: user._id });
  tokens.forEach(async (token) => {
    token.isValid = false;
    await token.save();
  });
  return res.json({ success: true });
};
