// const prisma = require("../config/database")
const {PrismaClient} = require("@prisma/client")

const prisma = new PrismaClient() 

const saveRefreshToken = async(userId, token, expiresIn) => {
  return await prisma.refreshToken.create({
    data:{
      userId,
      token,
      expiresIn,
    }
  })
}
const findRefreshToken = async (token) => {
  return await prisma.refreshToken.findUnique({
    where: {token}
  })
}

const revokedRefreshToken = async(token) => {
  return await prisma.refreshToken.update({
    where: {
      token
    },
    data: {isRevoked: true},
  })
}

const cleanExpiredTokens = async() => {
  await prisma.refreshToken.deleteMany({
    where: {
      expiresIn: { lt: new Date() }
    }
  })
}

module.exports = {
  saveRefreshToken,
  findRefreshToken,
  revokedRefreshToken,
  cleanExpiredTokens,
};