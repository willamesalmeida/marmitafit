const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
//import JWT autenticate
const jwt = require("jsonwebtoken");


const prisma = new PrismaClient();

class UserService {
  static async createUser(name, email, password) {
    //create a hash for password
    const hashedPassword = await bcrypt.hash(password, 10);

    //verify if email exist in database
    const existingEmail = await prisma.user.findUnique({ where: email });

    //create a new error if uuser not exist in database
    if (existingEmail) throw new Error("Email already exist");

    //create an user in database
    return await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  }
  static async authenticateUser(email, password){
    //verify if email exist in database
    const existingEmail = await prisma.user.findUnique({ where: email });
    //create an error if user not exist in database
    if(!existingEmail) throw new Error("User not found in database");

    //verify if password is correct 
    const passwordMatched = await bcrypt.compare(password, existingEmail.password)
    if(!passwordMatched) throw new Error("Password incorrect")

    // generete a JWT token
    const token = jwt.sign( {userId: existingEmail.id, isAdmin: existingEmail.isAdmin}, "SECRET_KEY", {expiresIn: "1h"});

    return token
  }
}

module.exports = UserService;