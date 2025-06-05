const Joi = require("joi");
/* password: Joi.string().pattern(new RegExp(("^(?=.*\d)(?=.*[a-zA-Z])(?=.*\W)[\d\w\W]{6,30}$"))).required(), */

const rules = {
  name: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).required(),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required(),
  phone: Joi.string().pattern(/^(\+\d{1,3}\s?)?(\(?\d{2,3}\)?[\s-]?)?\d{4,5}[-]?\d{4}$/).optional(),
  address: Joi.string().trim().min(5).max(100).optional()
};

const accountSignIn = (req, res, next) => {
  const { email, password } = req.body;

  const schema = Joi.object({
    email: rules.email,
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

const accountSignUp = (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  const schema = Joi.object({
    name: rules.name,
    email: rules.email,
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
