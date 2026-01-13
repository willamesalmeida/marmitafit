const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
require("dotenv").config();
const AppError = require("../utils/errorHandler.util");
cloudinary = require("../config/cloudinary");

//import JWT autenticate
const jwt = require("jsonwebtoken");
//Function DTO
const userDTO = require("../dtos/user.dtos");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/jwt.utils");

const { saveRefreshToken } = require("./refreshToken.service");

const prisma = new PrismaClient();
/* const salt = 10;
const saltRound = bcrypt.genSalt(salt); */

class UserService {
  static async createUser(name, email, password, isAdmin) {
    try {
      if (!name || !email || !password) {
        throw new AppError("All fields are required!", 400);
      }

      //verify if email exist in database
      const userBd = await prisma.user.findUnique({ where: { email } });

      //create a new error if uuser not exist in database
      if (userBd) {
        throw new AppError(
          "The email has already been used to register another user!",
          409
        );
      }
      //create a hash for password
      const hashedPassword = await bcrypt.hash(password, 10);

      //create an user in database
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          isAdmin,
        },
      });

      return {
        message: "User registered successfully!",
        user: userDTO(newUser),
      };
    } catch (error) {
      throw new AppError(
        error.message || "Error registering user!",
        error.statusCode
      );
    }
  }

  static async authenticateUser(email, password) {
    try {
      if (!email || !password) {
        throw new AppError("Email and password are required!", 400);
      }
      //verify if email exist in database
      const userBd = await prisma.user.findUnique({ where: { email } });

      //create an error if user not exist in database
      if (!userBd)
        throw new AppError(
          "The password or e-mail provided is different from registered by the user",
          401
        );

      //compare if password matched
      const passwordMatched = await bcrypt.compare(password, userBd.password);

      //verify if password is correct
      if (!passwordMatched) {
        throw new AppError(
          "The password or e-mail provided is different from registered by the user",
          401
        );
      } /* 
      // generete a JWT token
      const token = jwt.sign(
        { userId: userBd.id, isAdmin: userBd.isAdmin },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      ); */

      //genarete access token
      const accessToken = generateAccessToken({
        userId: userBd.id,
        isAdmin: userBd.isAdmin,
      });

      //generate refresh token
      const refreshToken = generateRefreshToken({
        userId: userBd.id,
      });

      //Save access token on DB
      await saveRefreshToken(
        userBd.id,
        refreshToken,
        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        deviceId
      );

      return { message: "Login successful!", accessToken,refreshToken, user: userDTO(userBd) };
    } catch (error) {
      throw new AppError(
        error.message || "Error during login!",
        error.statusCode || 500
      );
    }
  }
  // makes a request to the database by a user via email
  // It is used to check whether the user exists in the database or
  // not, in short, whether he is registered in the application.

  static async getUserByEmail(email) {
    try {
      // checks if the email was received
      if (!email) {
        throw new AppError("Email is required!", 400);
      }

      // checks if the user exists in the database
      const user = await prisma.user.findUnique({ where: { email } });

      if (!user) {
        throw new AppError("User not found!", 404);
      }
      console.log("getUserByEmail", user);

      return { message: "User found!", user: userDTO(user) };
    } catch (error) {
      throw new AppError(
        error.message || "Error fetching user!",
        error.statusCode || 500
      );
    }
  }

  // method to update password
  static async updatePassword(email, newPassword) {
    try {
      if (!email || !newPassword) {
        throw new AppError("Email and new password are required!", 400);
      }

      // create a hash for password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // returns a user already changing the user's password
      await prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      });

      return { message: "Password updated successfully!" };
    } catch (error) {
      throw new AppError(
        error.message || "Error updating password!",
        error.statusCode || 500
      );
    }
  }

  static async updateUserProfile(userId, updates, file) {
    try {
      if (!userId) {
        throw new AppError("User ID is required!", 400);
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new AppError("User not found!", 404);
      }
      // Data for update user informations
      const updateUserData = await prisma.user.update({
        where: { id: userId },
        data: {
          phone: updates.phone || user.phone,
          address: updates.address || user.address,
        },
      });

      // If there is an image file, add it to the update
      if (file) {
        updateUserData.profileImageUrl = file.path;
        updateUserData.profilePublicId = file.filename;
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: updateUserData,
      });

      return {
        message: "Profile updated successfully!",
        user: userDTO(updatedUser),
      };
    } catch (error) {
      throw new AppError(error.message || "Error updating profile!", 500);
    }
  }

  static async removeProfileImage(userId) {
    if (!userId) {
      throw new AppError("User ID is required!", 400);
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { profilePublicId: true, profileImageUrl: true },
    });

    if (!user) {
      throw new AppError("user not Found!", 404);
    }

    if (!user.profilePublicId) {
      return user;
    }

    try {
      const { result } = await cloudinary.uploader.destroy(
        user.profilePublicId
      );

      if (result.result !== "ok" && result.result !== "not_found") {
        console.warn(
          `Cloudinary.destroy returned unexpected result: ${result}`
        );
      }
    } catch (err) {
      console.error("Error removing profile image from cloudinary: ", err);
    }
    // updtae user to remove image profile
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        profileImageUrl: null,
        profilePublicId: null,
      },
    });
  }
  catch(error) {
    throw new AppError(error.message || "Error removing profile image!", 500);
  }

  static async deleteUser(userId) {
    await this.removeProfileImage(userId);

    await prisma.user.delete({
      where: { id: userId },
    });

    return { message: "User deleted successfully!" };
  }
}

module.exports = UserService;
