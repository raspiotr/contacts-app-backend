const { Schema, model } = require("mongoose");
const Joi = require("joi");

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
      minlenght: 6,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
  },
  { versionKey: false }
);

const handleMongoServerError = (error, data, next) => {
  const { name, code } = error;
  const status = name === "MongoServerError" && code === 11000 ? 409 : 400;
  error.status = status;
  next();
};

userSchema.post("save", handleMongoServerError);

const User = model("user", userSchema);

const logAndRegSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": `Missing required "email" - field`,
  }),

  password: Joi.string().min(8).required().messages({
    "any.required": `Missing required "password" - field`,
  }),
});

module.exports = { User, logAndRegSchema };
