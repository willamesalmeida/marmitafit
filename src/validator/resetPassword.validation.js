/* const Joi = require("joi");

const rules = {
  newPassword: Joi.string().min(6).max(30).required().message({
    "string.min": "Password must be at least 6 characters long",
    "string.max": "Password must be at most 30 characters long",
    "any.required": "Password is required",
  }),
  confirmNewPassword: Joi.string()
    .valid(Joi.ref("newPassword"))
    .required()
    .message({
      "any.required": "Confirm password is required",
      "any.only": "Passwords do not match",
    }),
};

const newPasswordSchema = Joi.object({
  newPassword: rules.newPassword,
  confirmNewPassword: rules.confirmNewPassword,
});

module.exports = { newPasswordSchema };
 */