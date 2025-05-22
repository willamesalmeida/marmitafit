// email trigger configuration file
const { sendResetEmail } = require("../services/mail.service");

//file with functions necessary for the controller to work
const UserService = require("../services/user.service");

// class that handles errors
const AppError = require("../utils/errorHandler.util");

// file to handle access token creation, validation and token refresh
const {
  generateResetToken,
  verifyResetToken,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  verifyAccessToken,
} = require("../utils/jwt.utils");

//file with functions needed for the controller
const RefreshTokenService = require("../services/refreshToken.services");

//library to management date
const dayjs = require("dayjs");

// const newPasswordSchema = require("../validator/resetPassword.validation");

class UserController {
  // register the user
  static async registerUser(req, res, next) {
    try {
      const { name, email, password, confirmPassword, isAdmin } = req.body;

      //verify if password and confirmation password matchated
      if (password != confirmPassword) {
        throw new AppError("Passwords do not match!", 400);
        /*  return res.status(400).json({ message: "Passwords do not match" }); */
      }

      //call the UserService that create a user in database
      const user = await UserService.createUser(name, email, password, isAdmin);

      res.status(201).json({ message: "User registered successfully!", user });
    } catch (error) {
      next(error);
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
      const { user } = await UserService.authenticateUser(email, password);

      // generate access token and refresh token
      const accessToken = generateAccessToken({
        userId: user.id,
        isAdmin: user.isAdmin,
      });

      const refreshToken = generateRefreshToken({ userId: user.id });

      // define data do expire refreshToken
      const expiresIn = dayjs().add(2, "minute").toDate();
      // const expiresIn = new Date(Date.now() + 7 * 24 * 60 * 60 * 100);

      await RefreshTokenService.saveRefreshToken(
        user.id,
        refreshToken,
        expiresIn
      );

      /*  if(token.error){
        return res.status(400).json({ message: "Invalid credentials", error });
      } */
      console.log("accessToken to teste (esse console esta no usercontroller): ", accessToken)
      res
        .status(200)
        .json({ message: "Login successful!", accessToken, refreshToken });
    } catch (error) {
      next(error);
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
        throw new AppError("User not found!", 404);
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
      next(error);

      /* res
        .status(500)
        .json({ message: "Error requesting password reset", error }); */
    }
  }
  // actually updates the password in the database
  static async resetPassword(req, res, next) {
    try {
      const { token, newPassword, confirmNewPassword } = req.body;

      if (newPassword != confirmNewPassword) {
        throw new AppError("Passwords do not match!", 400);
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
      // const decoded = verifyResetToken(token);
      const decoded = verifyAccessToken(token)

      //if false response the token is invalid or expired
      if (decoded.error) {
        throw new AppError(decoded.error, 401);
        /* return res
          .status(401)
          .json({ message: "Invalid token or token expired" }); */
      }

      //update the user password
      await UserService.updatePassword(decoded.email, newPassword);
      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      next(error);
      /* res.status(500).json({ message: "Error resetting password", error }); */
    }
  }
  // checks the refresh token and creates a new access token
  static async userRefreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body;

      console.log("REFRESHTOKEN: ", refreshToken);

      if (!refreshToken) {
        throw new AppError("Refresh token not provided", 401);
      }
      
      //Search for refresh token in database
      const storedToken = await RefreshTokenService.findRefreshToken(
        refreshToken
      );
      console.log("storedToken", storedToken);
      if (!storedToken) {
        console.log("log do storedtoken")
        throw new AppError("Invalid refresh token", 403);
      }
      // Verify if the refresh token is expired
      verifyRefreshToken(refreshToken);

      //verify if the refresh token stored is expired
      if (dayjs(storedToken.expiresIn).isBefore(dayjs())) {
        throw new AppError("Refresh token expired", 403);
      }
      /*  if (new Date(storedToken.expiresIn) < new Date()) {
        throw new AppError("Refresh token has expired", 403);
      } */

      //generate a new access token
      const newAccessToken = generateAccessToken({
        userId: storedToken.userId,
      });

      res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      next(error);
    }
  }
  // Endpoint for logout that revokes the refresh token
  static async logout(req, res, next) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        throw new AppError("Refresh token required", 400);
      }

      // mark the refresh token as invalid
      await RefreshTokenService.revokedRefreshToken(refreshToken);
      res.status(200).json({
        message: "Logout successful!",
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProfileImage(req, res, next) {
    try {
      const userId = req.user.userId;
      const file = req.file;

      const updateUser = await UserService.updateProfileImage(userId, file)

      res.status(200).json({message: "Profile image updated successfully!", user: updateUser})
    } catch (error) {
      next(error)
    }
  }
}

module.exports = UserController;
