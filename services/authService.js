const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;
const path = require("path");
const gravatar = require("gravatar");
const jimp = require("jimp");

require("dotenv").config();

const { SECRET_KEY } = process.env;
const { User } = require("../schemas/users");
const avatarDirectory = path.join(__dirname, "../", "public", "avatars");

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
    const avatarURL = gravatar.url(email, {
      protocol: "https",
      s: "250",
      default: "retro",
    });
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
    });

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

const updateUserAvatar = async (req, res, next) => {
  const { path: temporaryName } = req.file;

  try {
    const image = await jimp.read(temporaryName);
    await image
      .autocrop()
      .cover(
        250,
        250,
        jimp.HORIZONTAL_ALIGN_CENTER | jimp.VERTICAL_ALIGN_MIDDLE
      )
      .writeAsync(temporaryName);
  } catch (error) {
    return next(error);
  }

  const { _id } = req.user;
  const newFilename = `${_id}_${Date.now()}.jpg`;
  const resultUpload = path.join(avatarDirectory, newFilename);

  try {
    await fs.rename(temporaryName, resultUpload);
  } catch (error) {
    return next(error);
  }

  const avatarURL = path.join("avatars", newFilename);

  try {
    await User.findByIdAndUpdate(_id, { avatarURL });
    return res.status(200).json({ avatarURL });
  } catch (error) {
    return next(error);
  }
};

module.exports = { signup, login, logout, current, updateUserAvatar };
