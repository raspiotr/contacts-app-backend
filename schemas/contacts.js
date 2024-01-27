const { Schema, model } = require("mongoose");
const Joi = require("joi");

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false }
);

const Contact = model("contacts", contactSchema);

const addContactSchema = Joi.object({
  name: Joi.string()
    .required()
    .messages({ "any.required": "Missing required 'name' - field" }),
  email: Joi.string().email().required().messages({
    "any.required": "Missing required 'email' - field",
  }),
  phone: Joi.string().required().messages({
    "any.required": "Missing required 'phone' - field",
  }),
  favorite: Joi.boolean().optional(),
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean()
    .required()
    .messages({ "any.required": `Missing field 'favorite'` }),
});

module.exports = { Contact, addContactSchema, updateFavoriteSchema };
