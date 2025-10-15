// const prisma = require("../config/database")
const { PrismaClient } = require("@prisma/client");
const dayjs = require("dayjs");

//class handler error
const AppError = require("../utils/errorHandler.util");

const prisma = new PrismaClient();

/* const saveRefreshToken = async (userId, token, expiresIn) => {
  
  // capture the token in the database
  const existingToken = await prisma.refreshToken.findUnique({
    where: { userId },
  });


  // checks if the token exists in the database and if is valid
  if (existingToken && dayjs(existingToken.expiresIn).isAfter(dayjs())) {
    throw new AppError("User already is logged in!", 403)
    // return {
     // message: "Usuário já está logado",
     // refreshToken: existingToken.token,
     // expiresIn: existingToken.expiresIn,
   // }; 
  }
  // Update or create a new token
  const newToken = await prisma.refreshToken.upsert({
    where: { userId },
    update: { token, expiresIn},
    create: { userId, token, expiresIn},
  });

  return newToken;

  //return await prisma.refreshToken.create({
   // data: {
   //   userId,
   //   token,
    //  expiresIn,
    //},
  //}); 
}; */

const saveRefreshToken = async (userId, token, expiresIn, deviceId = null) => {
  try {
    if(deviceId) {
      await prisma.refreshToken.updateMany({
        where: { userId, deviceId, isRevoked: false},
        data: {isRevoked: true},
      });
    }
    return await prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresIn,
        deviceId,
      },
    });
  } catch (error) {
    // console.error("Error saving refresh token:", error);
    throw new AppError("Error saving refresh token", 500);
  }
};

const findRefreshToken = async (token) => {
  return await prisma.refreshToken.findUnique({
    where: { token },
  });
};

const revokedRefreshToken = async (token) => {
  return await prisma.refreshToken.update({
    where: {
      token,
    },
    data: { isRevoked: true },
  });
};

const cleanExpiredTokens = async () => {
  await prisma.refreshToken.deleteMany({
    where: {
      expiresIn: { lt: new Date() },
    },
  });
};

module.exports = {
  saveRefreshToken,
  findRefreshToken,
  revokedRefreshToken,
  cleanExpiredTokens,
};
