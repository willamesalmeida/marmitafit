const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "chave_super_secreta";

const authIsAdminMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); //decodes the token received in the request

    if (!decoded.isAdmin) {
      return res
        .status(401)
        .json({
          message:
            "Access denied. You don't have permission. Only administrators can register a product",
        });
    }

    req.user = decoded;  //add the authenticated user information to the request
    
    next();

  } catch (error) {
    console.log(error)
    res.status(403).json({ message: "Invalid token or expired token", error});
  }
};

module.exports = authIsAdminMiddleware;
