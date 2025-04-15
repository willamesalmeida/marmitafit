const Joi = require("joi");

const productSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  price: Joi.number().integer().min(1).positive().required(),
  description: Joi.string().min(10).max(300).required(),
  // imageUrl: Joi.string().uri().required(),
  imageUrl: Joi.string().required(),
});

module.exports = { productSchema };
