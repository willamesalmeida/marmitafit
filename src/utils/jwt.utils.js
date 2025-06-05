const jwt = require("jsonwebtoken");
require("dotenv").config();
const ACESS_TOKEN_EXPIRES = "10m";
const REFRESH_TOKEN_EXPIRES = "2m";
const ACCESS_RESET_TOKEN_EXPIRES = "15m";
const AppError = require("../utils/errorHandler.util");

//generate access token
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: ACESS_TOKEN_EXPIRES,
  });
};

//generate refresh token
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, {
    expiresIn: REFRESH_TOKEN_EXPIRES,
  });
};

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    throw new AppError("Invalid or expired access token!", 400);
  }
};
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    throw new AppError("Invalid or expired refresh token!", 400);
  }
};

const generateResetToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
    expiresIn: ACCESS_RESET_TOKEN_EXPIRES,
  });
};

const verifyResetToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    return { error: "Invalid or expired token!", details: error.message };
  }
};

module.exports = {
  generateResetToken,
  generateAccessToken,
  generateRefreshToken,
  verifyResetToken,
  verifyAccessToken,
  verifyRefreshToken,
};
