const Joi = require("joi");

const addressSchema = Joi.object({
  street: Joi.string().min(3).max(100).required().messages({
    "string.min": "Street must be at least 3 characters long",
    "string.empty": "Street cannot be empty",
  "any.required":"Street is required",}),

  number: Joi.string().min(1).max(10).required().messages({
    "string.min": "Number must be at least 1 character long",
    "string.empty": "Number cannot be empty",
  "any.required":"Number is required",}),

  complement: Joi.string().max(50).optional().allow(""),

  district: Joi.string().min(3).max(50).required().messages({
    "string.min": "District must be at least 3 characters long",
    "any.required": "District is required",
  }),

  city: Joi.string().min(3).max(50).required().messages({
    "string.min": "City must be at least 3 characters long",
    "string.empty": "City cannot be empty",
  "any.required":"City is required",}),

  state: Joi.string().length(2).uppercase().required().messages({
    "string.length": "State must be exactly 2 characters long (ex.: AL)",
    "string.empty": "State cannot be empty",
  "any.required":"State is required",}),
  zipCode: Joi.string().pattern(/^\d{5}-\d{3}$/).required().messages({
    "string.pattern.base": "Zip code must be in the format 12345-678",
    "string.empty": "Zip code cannot be empty",
  "any.required":"Zip code is required",}),
});

const validateAddress = (req, res, next) => {
  const option = {abortEarly: false};
  const {error} = addressSchema.validate(req.body, option);
  if (error){
    return res.status(400).json({
      message: "Validation errors",
      details: error.details.map((detail) => detail.message),
    })
  }
  next();
}

module.exports = {validateAddress}