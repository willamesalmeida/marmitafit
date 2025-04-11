const UserController = require("../controllers/user.controller")
/* const express = require("express") */
const { Router } = require("express")
// const {accountSignIn, accountSignUp, passwordReset} = require("../validator/user.validation")

/* const router = express.Router() */
const router = Router()

router.post('/register', /* accountSignUp, */ UserController.registerUser);
router.post('/login', /* accountSignIn, */ UserController.loginUser)

router.post('/reset-password/request', UserController.requestPasswordReset)
router.post('/reset-password', /* passwordReset, */ UserController.resetPassword)



module.exports = router