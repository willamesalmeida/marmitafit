//import library necessarys to do something kkk
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { cleanExpiredTokens } = require("./services/refreshToken.service.js");

//import database connection
const database = require("./config/database.js");

//import routes for use in express
const userRoutes = require("./routes/user.routes.js");
const productRoutes = require("./routes/product.routes.js");
const orderRoutes = require("./routes/order.routes.js");
const cartRoutes = require("./routes/cart.routes.js");
const adminRoutes = require("./routes/admin.routes.js");

//import middleware handle error
const errorHandlerMiddleware = require("./middlewares/errorHandler.middleware.js");
const {
  limiter,
  speedLimiter,
} = require("./middlewares/rateLimiter.middleware.js");

const app = express();

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
  method: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//middleware limit rate and slowing down request
app.use(limiter);
app.use(speedLimiter);
//middleware routes
app.use(userRoutes); //add users routes
app.use(productRoutes); //add product routes
app.use(orderRoutes); //add order routes
app.use(cartRoutes); //add cart routes
app.use(adminRoutes); //add admin routes

app.get("/", (req, res) => {
  res.send("API funcionando");
});

(async () => {
  await database();
})();

const PORT = process.env.PORT || 5000;
const HOST = process.env.DB_HOST;

/*error middleware
app.use((error, req, res, next) => {
  const { statusCode = 500, message = "Erro interno do servidor" } = error;
  
  if (process.env.APP_DEBUG) {
    console.error(error);
    return res.status(statusCode).json({
      status: "Error",
      message,
      error,
    });
  } else {
    return res.status(statusCode).json({
      status: "Error",
      message,
    });
  }
}); */

/* another error middleware 
 app.use( function (error, request, response, next){
    if(process.env.APP_DEBUG){
      console.error(error);
      return response.status(error.statusCode ?? 500).json({
        status:"Error",
        message: error.message,
        error: error
      })
    } else {
      return response.status(error.statusCode ?? 500).json({
        status: "error",
        message: error.message,
      })
    }
  }) */

app.use(errorHandlerMiddleware);
app.listen(PORT, async () => {
  try {
    /* await dbConection.sync( {alter: true}); */
    console.log(`The server is runing on port ${PORT}`);
    console.log(`http://${HOST}:${PORT}`);
    // gerador de secretekey para jwt
    // console.log(require('crypto').randomBytes(32).toString('hex'))
    setInterval(async () => {
      try {
        await cleanExpiredTokens();
        console.log("Expired refresh tokens cleaned up");
      } catch (error) {
        console.error("Error cleaning expired tokens:", error);
      }
    }, 60 * 60 * 1000);
     // Run every hour
  } catch (error) {
    console.error("Error to syncronized to database:", error);
  }
});
