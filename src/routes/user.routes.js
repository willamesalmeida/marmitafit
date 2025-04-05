const UserController = require("../controllers/user.controller")
/* const express = require("express") */
const { Router } = require("express")
// const {accountSignIn, accountSignUp} = require("../validator/user.validation")

/* const router = express.Router() */
const router = Router()

router.post('/register', /* accountSignUp, */ UserController.registerUser);
router.post('/login', /* accountSignIn, */ UserController.loginUser)
router.post('/reset-password/request', UserController.requestPasswordReset)
router.post('/reset-password', UserController.resetPassword)
module.exports = router