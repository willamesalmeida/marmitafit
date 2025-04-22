const { sendResetEmail } = require("../services/mail.service");
const UserService = require("../services/user.service");
const AppError = require("../utils/errorHandler.util");
const { generateResetToken, verifyResetToken } = require("../utils/jwt.utils");
// const newPasswordSchema = require("../validator/resetPassword.validation");

class UserController {
  // register the user
  static async registerUser(req, res, next) {
    try {
      const { name, email, password, confirmPassword, isAdmin } = req.body;

      //verify if password and confirmation password matchated
      if (password != confirmPassword) {
        throw new AppError("Passwords do not match!", 400)
       /*  return res.status(400).json({ message: "Passwords do not match" }); */
      }

      //call the UserService that create a user in database
      const user = await UserService.createUser(name, email, password, isAdmin);

      res.status(201).json({ message: "User registered successfully!", user });
    } catch (error) {
      next(error)
   /*    res.status(400).json({
        message: "Error registering user",
        error,
      }); */
    }
  }

  // login the user
  static async loginUser(req, res, next) {
    try {
      const { email, password } = req.body;

      // crete a token
      const token = await UserService.authenticateUser(email, password);
      
      
     /*  if(token.error){
        return res.status(400).json({ message: "Invalid credentials", error });
      }  */

      res.status(200).json({ message: "Login successful!", token });

    } catch (error) {
      next(error)      
      // res.status(401).json({ message: "Login error", error });
    }
  }

  //request to reset password
  static async requestPasswordReset(req, res, next) {
    try {
      const { email } = req.body;

      //capture the user in the database from the email
      const user = await UserService.getUserByEmail(email);

      // checks if the email exists in the database
      if (!user) {
        throw new AppError("User not found!", 404)
       /*  return res.status(404).json({
          message: "User not found!",
        }); */
      }

      // create a token for email
      const token = generateResetToken(email);
      //send password reset email
      await sendResetEmail(email, token);

      res.status(200).json({
        message: "Recovery email sent!",
      });
    } catch (error) {
      next(error)
      
      /* res
        .status(500)
        .json({ message: "Error requesting password reset", error }); */
    }
  }

  static async resetPassword(req, res, next) {
    try {
      const { token, newPassword, confirmNewPassword } = req.body;

      if (newPassword != confirmNewPassword) {
        throw new AppError("Passwords do not match!", 400)
        /* return res.status(400).json({ message: "Passwords do not match" }); */
      }
      /*  //validation the data request
      const { error } = newPasswordSchema.validate(
        { newPassword, confirmNewPassword },
        { abortEarly: false }
      );

      if (error) {
        return res.status(400).json({
          messege: "Validation error!",
          errors: error.details.map((detail) => detail.message),
        });
      } */

      //verify token in request
      const decoded = verifyResetToken(token);

      //if false response the token is invalid or expired
      if (!decoded) {
        throw new AppError("Invalid token or token expired!", 401)
        /* return res
          .status(401)
          .json({ message: "Invalid token or token expired" }); */
      }

      //update the user password
      await UserService.updatePassword(decoded.email, newPassword);
      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      next(error)
      /* res.status(500).json({ message: "Error resetting password", error }); */
    }
  }
}

module.exports = UserController;
