const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
require("dotenv").config();

//import JWT autenticate
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();
/* const salt = 10;
const saltRound = bcrypt.genSalt(salt); */

class UserService {
  static async createUser(name, email, password, isAdmin) {
    //create a hash for password
    const hashedPassword = await bcrypt.hash(password, 10);

    //verify if email exist in database
    const userBd = await prisma.user.findUnique({ where: { email } });

    //create a new error if uuser not exist in database
    try {
      if (userBd) throw new Error("The email has already been used to register another user!");
      
    } catch (error) {
      return {error: "Email already exist!", details: error.message}
      
    }

    //create an user in database
    return await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        isAdmin,
      },
    });
  }

  static async authenticateUser(email, password) {
    //verify if email exist in database
    const userBd = await prisma.user.findUnique({ where: { email } });
    //create an error if user not exist in database
    try {
      if (!userBd) throw new Error("No user with that email was found in the database!");
    } catch (error) {
      return { error: "User not found in database", details: error.message };
    }

    //verify if password is correct
    const passwordMatched = await bcrypt.compare(password, userBd.password);
    try {
      if (!passwordMatched) throw new Error("The password provided is different from the password registered by the user");
    } catch (error) {
      return { error: "Password incorrect", details: error.message };
    }

    // generete a JWT token
    const token = jwt.sign(
      { userId: userBd.id, isAdmin: userBd.isAdmin },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    return token;
  }
  // makes a request to the database by a user via email
  // It is used to check whether the user exists in the database or
  // not, in short, whether he is registered in the application.

  static async getUserByEmail(email) {
    return await prisma.user.findUnique({ where: { email } });
  }

  // method to update password
  static async updatePassword(email, newPassword) {
    // create a hash for password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // returns a user already changing the user's password
    return await prisma.user.update({
      where: { email },
      data: { password: hashedPassword },
    });
  }
}

module.exports = UserService;
