const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const { SECRET_KEY } = process.env;
const { User } = require("../schemas/users");

const signup = async (req, res, next) => {
  const { email, password } = req.body;
  let user;
  try {
    user = await User.findOne({ email });
  } catch (error) {
    return next(error);
  }

  if (user) {
    return res.status(409).json({
      status: "error",
      message: "Email in use",
      data: "Conflict",
    });
  }

  try {
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ ...req.body, password: hashPassword });

    res.status(201).json({
      user: {
        email: newUser.email,
        subscription: newUser.subscription,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let user;
  try {
    user = await User.findOne({ email });
  } catch (error) {
    return next(error);
  }

  if (!user) {
    return res.status(401).json({
      status: "error",
      message: "Email or password is wrong",
      data: "Unauthorized",
    });
  }

  let isPasswordValid;
  try {
    isPasswordValid = await bcrypt.compare(password, user.password);
  } catch (error) {
    return next(error);
  }

  if (!isPasswordValid) {
    return res.status(401).json({
      status: "error",
      message: "Email or password is wrong",
      data: "Unauthorized",
    });
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "4h" });

  try {
    await User.findByIdAndUpdate(user._id, { token });

    return res.status(200).json({
      token: token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const logout = async (req, res, next) => {
  const { _id } = req.user;
  let result;
  try {
    result = await User.findByIdAndUpdate(_id, { token: "" });
  } catch (error) {
    return next(error);
  }

  if (!result) {
    return res.status(404).json({
      status: "error",
      message: "Not found",
    });
  }

  return res.status(204).json({});
};

const current = async (req, res) => {
  const { email, subscription } = req.user;
  return res.status(200).json({
    email,
    subscription,
  });
};

module.exports = { signup, login, logout, current };
