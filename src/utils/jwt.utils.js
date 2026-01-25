const jwt = require("jsonwebtoken");
require("dotenv").config();
const AppError = require("../utils/errorHandler.util");
const { v4: uuidv4 } = require("uuid");

// Tempos de expiração
const ACESS_TOKEN_EXPIRES = "15m";  // Aumentado de "2m" para "15m"
const REFRESH_TOKEN_EXPIRES = "7d";
const ACCESS_RESET_TOKEN_EXPIRES = "15m";

// Generate access token
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: ACESS_TOKEN_EXPIRES,
  });
};

// Generate refresh token
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, {
    expiresIn: REFRESH_TOKEN_EXPIRES,
    jwtid: uuidv4(),
  });
};

// Verify access token
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    throw new AppError("Invalid or expired access token!", 401);
  }
};

// Verify refresh token (ORIGINAL E CORRETO)
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET_KEY);
  } catch (error) {
    // Distinguir entre token expirado e inválido
    if (error.name === 'TokenExpiredError') {
      throw new AppError("Refresh token expired", 401);
    }
    throw new AppError("Invalid refresh token", 403);
  }
};

// Generate reset token
const generateResetToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
    expiresIn: ACCESS_RESET_TOKEN_EXPIRES,
  });
};

// Verify reset token
const verifyResetToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    throw new AppError("Invalid or expired token!", 401);
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