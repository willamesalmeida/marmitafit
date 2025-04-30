const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
require("dotenv").config();
const AppError = require("../utils/errorHandler.util");

//import JWT autenticate
const jwt = require("jsonwebtoken");
//Function DTO
const userDTO = require("../dtos/user.dtos");

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

      return { message: "User registered successfully!", user: newUser };
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
          "No user with that email was found in the database!",
          404
        );

      //compare if password matched
      const passwordMatched = await bcrypt.compare(password, userBd.password);

      //verify if password is correct
      if (!passwordMatched) {
        throw new AppError(
          "The password provided is different from the password registered by the user"
        );
      }
      // generete a JWT token
      const token = jwt.sign(
        { userId: userBd.id, isAdmin: userBd.isAdmin },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );
    
      return { message: "Login successful!", token, user: userDTO(userBd) };
      
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

      return { message: "User found!", user };
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
}

module.exports = UserService;
