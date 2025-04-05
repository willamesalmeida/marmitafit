const jwt = require("jsonwebtoken")

const authMiddleware = (req, res, next) => {
  const token = req.header.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access denied. No token provided."});

  try{
    const decoded = jwt.verify(token, processe.env.JWT_SECRET_KEY) //decodes the token received in the request
    req.user = decoded //add the authenticated user to the request
    next();
  }
  catch(error){
    res.status(403).json({message: "Invalid token or expired token"})
  }
}

module.exports = authMiddleware;