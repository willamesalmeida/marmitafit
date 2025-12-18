//constollers
const AddressController = require("../controllers/address.controller");
const UserController = require("../controllers/user.controller");

//validators  
const { validateAddress } = require("../validator/address.validation");

/* const express = require("express") */

const { Router } = require("express");
const {
  accountSignIn,
  accountSignUp,
  passwordReset,
} = require("../validator/user.validation");
const {
  verifyTokenMiddleware,
} = require("../middlewares/authIsAdmin.middleware");

const upload = require("../middlewares/upload.middleware");
const { validateProfileUpdate } = require("../validator/user.validation");
const Joi = require("joi");



/* const router = express.Router() */
const router = Router();

const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

const validateRefreshToken = (req, res, next) => {
  const { error } = refreshTokenSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({
      message: "Validation error",
      details: error.details.map((detail) => detail.message),
    });
  }
  next();
};

router.post("/register", accountSignUp, UserController.registerUser);
router.post("/login", accountSignIn, UserController.loginUser);
router.post("/logout", UserController.logout);
router.post("/refresh", validateRefreshToken, UserController.userRefreshToken);
router.post("/reset-password/request", UserController.requestPasswordReset);
router.post("/reset-password", passwordReset, UserController.resetPassword);

// update phone number and address
router.patch(
  "/users/profile",
  verifyTokenMiddleware,
  upload.single("profileImage"),
  validateProfileUpdate,
  UserController.updateUserProfile
);

//remove profile image
router.delete("/users", verifyTokenMiddleware, UserController.deleteUser);

router.post("/users/addresses", verifyTokenMiddleware, validateAddress, AddressController.createAddress);
router.get("/users/addresses", verifyTokenMiddleware, AddressController.getUserAddresses);
router.patch("/users/addresses/:id", verifyTokenMiddleware, validateAddress, AddressController.updateAddress);
router.delete("/users/addresses/:id", verifyTokenMiddleware, AddressController.deleteAddress);

module.exports = router;
