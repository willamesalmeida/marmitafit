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
  deviceId: Joi.string().optional().allow(null, ""), // deviceId is optional
});

const validateRefreshToken = (req, res, next) => {
  const { error } = refreshTokenSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: true, // Allow extra fields (like deviceId) without error
  });
  if (error) {
    return res.status(400).json({
      message: "Validation error",
      details: error.details.map((detail) => detail.message),
    });
  }
  next();
};
//Public routes
router.post("/register", accountSignUp, UserController.registerUser);
router.post("/login", accountSignIn, UserController.loginUser);
router.post("/logout", UserController.logout);
// Refresh route with log for debug
router.post("/refresh", (req, res, next) => {
  console.log("📍 ROUTE /refresh ACCESSED");
  console.log("   Time:", new Date().toISOString());
  console.log("   Body keys:", Object.keys(req.body));
  next();
}, validateRefreshToken, UserController.userRefreshToken);
router.post("/reset-password/request", UserController.requestPasswordReset);
router.post("/reset-password", passwordReset, UserController.resetPassword);

// update phone number and address
router.patch(
  "/users/profile",
  verifyTokenMiddleware,
  upload.single("profileImage"),
  validateProfileUpdate,
  UserController.updateUserProfile,
);

//remove profile image
router.get("/me", verifyTokenMiddleware, UserController.me);

router.delete("/users", verifyTokenMiddleware, UserController.deleteUser);

router.post(
  "/users/addresses",
  verifyTokenMiddleware,
  validateAddress,
  AddressController.createAddress,
);
router.get(
  "/users/addresses",
  verifyTokenMiddleware,
  AddressController.getUserAddresses,
);
router.patch(
  "/users/addresses/:id",
  verifyTokenMiddleware,
  validateAddress,
  AddressController.updateAddress,
);
router.delete(
  "/users/addresses/:id",
  verifyTokenMiddleware,
  AddressController.deleteAddress,
);



module.exports = router;
