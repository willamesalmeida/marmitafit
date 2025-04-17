const jwt = require("jsonwebtoken");
require("dotenv").config();
const timeToExpire = "15m";

const generateResetToken = (email) => {
  return jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
    expiresIn: timeToExpire,
  });
};

const verifyResetToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY);
  } catch (error) {
    return { error: "Ivalid or expired token", details: error.message };
  }
};

module.exports = { generateResetToken, verifyResetToken };
