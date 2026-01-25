// const prisma = require("../config/database")
const { PrismaClient } = require("@prisma/client");
const dayjs = require("dayjs");
//class handler error
const AppError = require("../utils/errorHandler.util");

const prisma = new PrismaClient();

const MAX_ACTIVE_TOKENS = 5;
/**
 * Saves a new refresh token to the database, revoking old tokens from the same device and limiting the total number of active tokens.
 * @param {string} userId - ID of the user
 * @param {string} token - Refresh token JWT
 * @param {Date} expiresIn - Expiration date of the token
 * @param {string|null} deviceId - ID of the device (optional)
 * @returns {Promise<Object>} - Object of the refresh token saved
 * @throws {AppError} - If an error occurs during saving process token or exceeding the limit
 */

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
    // revoked the old tokens for the same user and device, if deviceId is provided

    if (deviceId) {
      await prisma.refreshToken.updateMany({
        where: { userId, deviceId, isRevoked: false },
        data: { isRevoked: true },
      });
    }

    //Verify the number of active tokens for the user
    const activeTokens = await prisma.refreshToken.count({
      where: {
        userId,
        isRevoked: false,
        expiresIn: { gte: new Date() }, // only count tokens that are not revoked and not expired
      }
    })

    if (activeTokens >= MAX_ACTIVE_TOKENS) {
      //Revokes the oldest token if the limit is reached
      const oldestToken = await prisma.refreshToken.findFirst({
        where: {
          userId,
          isRevoked: false,
          expiresIn: { gte: new Date() }, // only consider active tokens
        },
        orderBy: { createdAt: 'asc' }
      })

      if (oldestToken) {
        await prisma.refreshToken.update({
          where: { id: oldestToken.id },
          data: { isRevoked: true },
        });
      } else {
        throw new AppError("Unable to revoke oldest token", 500);
      }
    }
    // create a new token
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
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token },
  });

  // Verify if token exist in database and not expired
  if (storedToken) {
    const now = new Date();
    const expiresIn = new Date(storedToken.expiresIn);
    
    // If token expired in database, return null
    if (expiresIn < now) {
      return null;
    }
  }

  return storedToken;
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
