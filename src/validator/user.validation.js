const Joi = require("joi");
/* password: Joi.string().pattern(new RegExp(("^(?=.*\d)(?=.*[a-zA-Z])(?=.*\W)[\d\w\W]{6,30}$"))).required(), */

const rules = {
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  //the password must be between 6 to 30 characters long and contain at least one letter, one number, and one special character.
  password: Joi.string()
    .min(8)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])"))
    .required()
    .messages({
      "string.min": "The password must be at least 8 characters long",
      "string.pattern.base": "The password must contain at least 1 uppercase letter, 1 lowercase letter and 1 special character (!@#$%^&*)",
      "any.required": "The password is required",
    }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "The passwords do not match",
    "any.required": "The password confirmation is required",
  }),

  phone: Joi.string().pattern(/^(\+\d{1,3}\s?)?(\(?\d{2,3}\)?[\s-]?)?\d{4,5}[-]?\d{4}$/).optional(),
  address: Joi.string().trim().min(5).max(100).optional()
};

//login validation
const accountSignIn = (req, res, next) => {
  const { email, password } = req.body;
y
  const schema = Joi.object({
    email: rules.email.messages({
      "string.email": "Please enter a valid email address",
      "any.required": "The email is required",
    }),
    password: rules.password,
  });

  const options = { abortEarly: false };

  const { error } = schema.validate(
    {
      email,
      password,
    },
    options
  );

  if (error) {
    return res.status(400).json({
      message: "validation error",
      details: error.details.map((detail) => detail.message),
    });
  }

  /* console.log(error.details.map(errDetail => errDetail.type), error);*/
  next();
};

//registration validation

const accountSignUp = (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  const schema = Joi.object({
    name: rules.name.messages({
      "string.min": "the name have at least 3 characters",
      "string.max": "the name have maximum 20 characters",
      "any.required": "The name is required",
    }),
    email: rules.email.messages({
      "string.email": "Please enter a valid email address",
      "any.required": "The email is required",
    }),
    password: rules.password,
    confirmPassword: rules.confirmPassword,
  });

  const option = { abortEarly: false };

  const { error } = schema.validate(
    {
      name,
      email,
      password,
      confirmPassword,
    },
    option
  );

  if (error) {
    return res.status(400).json({
      message: "validation error",
      details: error.details.map((detail) => detail.message),
    });
  }
  next();
};

// password reset validation
const passwordReset = (req, res, next) => {
  const { newPassword, confirmNewPassword } = req.body;

  const schema = Joi.object({
    newPassword: rules.password,
    confirmNewPassword: rules.confirmPassword,
  });

  const option = { abortEarly: false };

  const { error } = schema.validate(
    {
      newPassword,
      confirmNewPassword,
    },
    option
  );

  if (error) {
    return res.status(400).json({
      message: "validation error",
      details: error.details.map((detail) => detail.message),
    });
  }
  next();
};

const validateProfileUpdate = (req, res, next) => {
  const {phone, address } = req.body;

  const schema = Joi.object({
    phone: rules.phone,
    address: rules.address,
  })

  const option ={ abortEarly: false }

  const { error } = schema.validate({
    phone,
    address,
  }, 
option);

if(error) {
  return res.status(400).json({
    message: "Validation error",
    details: error.details.map((detail) => detail.message)
  })
}
next()
}

module.exports = { accountSignUp, accountSignIn, passwordReset, validateProfileUpdate };
