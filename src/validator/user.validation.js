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
      "string.min": "A senha deve ter pelo menos 8 caracteres",
      "string.pattern.base": "A senha deve conter pelo menos 1 letra maiúscula, 1 minúscula e 1 caractere especial (!@#$%^&*)",
      "any.required": "A senha é obrigatória",
    }),
  confirmPassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "As senhas não coincidem",
    "any.required": "A confirmação da senha é obrigatória",
  }),

  phone: Joi.string().pattern(/^(\+\d{1,3}\s?)?(\(?\d{2,3}\)?[\s-]?)?\d{4,5}[-]?\d{4}$/).optional(),
  address: Joi.string().trim().min(5).max(100).optional()
};

//login validation
const accountSignIn = (req, res, next) => {
  const { email, password } = req.body;

  const schema = Joi.object({
    email: rules.email.messages({
      "string.email": "Por favor, insira um endereço de email válido",
      "any.required": "O email é obrigatório",
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
      "string.min": "O nome deve ter pelo menos 3 caracteres",
      "string.max": "O nome deve ter no máximo 20 caracteres",
      "any.required": "O nome é obrigatório",
    }),
    email: rules.email.messages({
      "string.email": "Por favor, insira um endereço de email válido",
      "any.required": "O email é obrigatório",
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
