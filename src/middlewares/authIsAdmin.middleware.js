const jwt = require("jsonwebtoken");
require("dotenv").config();
const {verifyAccessToken} = require("../utils/jwt.utils")



const authIsAdminMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // const decoded = verifyResetToken(token); //everytime I use this functio to verify token, was returned an error
    // const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); //decodes the token received in the request

    const decoded = verifyAccessToken(token)

    if (!decoded || typeof decoded.isAdmin === "undefined" || !decoded.isAdmin ) {
      return res.status(401).json({
        message:
          "Access denied! You don't have permission, only administrators can register a product",
      });
    }

    req.user = decoded; //add the authenticated user information to the request

    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token or expired token!", error });
  }
};

const verifyTokenMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token not provided!" });
  }

  try {
    // const decoded = verifyResetToken(token);
    //const decoded = verifyAccessToken(token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)

    if (decoded.error) {
      return res.status(403).json({
        message: "The token sent is invalid or has expired!",
        details: decoded.details,
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token or token expire!", error });
  }
};

module.exports = { authIsAdminMiddleware, verifyTokenMiddleware };
