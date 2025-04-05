const jwt = require("jsonwebtoken")
require("dotenv").config()
const option = '15m'

const generateResetToken = (email) => {
  return jwt.sign({email}, process.env.JWT_SECRET_KEY, {option})
}

const verifyResetToken = (token) => {
  try {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);    
  } catch (error) {
    return null    
  }
}

module.exports = {generateResetToken, verifyResetToken}
