const UserController = require("../controllers/user.controller");
/* const express = require("express") */
const { Router } = require("express");
// const {accountSignIn, accountSignUp, passwordReset} = require("../validator/user.validation")
const {
  verifyTokenMiddleware,
} = require("../middlewares/authIsAdmin.middleware");

const upload = require("../middlewares/upload.middleware");

/* const router = express.Router() */
const router = Router();

router.post("/register", /* accountSignUp, */ UserController.registerUser);
router.post("/login", /* accountSignIn, */ UserController.loginUser);
router.post("/logout", UserController.logout);
router.post("/refresh", UserController.userRefreshToken);
router.post("/reset-password/request", UserController.requestPasswordReset);
router.post("/reset-password",/* passwordReset, */ UserController.resetPassword);

// update phone number and address
router.patch("/users/profile", verifyTokenMiddleware, upload.single("profileImage"), UserController.updateUserProfile);


module.exports = router;
