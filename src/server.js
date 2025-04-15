//import library necessarys to do something kkk
require("dotenv").config();
const express = require("express");
const cors = require("cors");

//import database connection
const database = require("./config/database.js");
//import routes for use in express
const userRoutes = require("./routes/user.routes.js");
const productRoutes = require("./routes/product.routes.js")
const app = express();

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
  method: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(userRoutes); //add users routes
app.use(productRoutes)//add product routes

app.get("/", (req, res) => {
  res.send("API funcionando");
});


app.use((error, req, res, next) => {
  const { statusCode = 500, message = "Erro interno do servidor" } = error;
  
  if (process.env.APP_DEBUG) {
    console.error(error);
    return response.status(statusCode).json({
      status: "Error",
      message,
      error,
    });
  } else {
    return response.status(statusCode).json({
      status: "Error",
      message,
    });
  }
});

(async () => {
  await database();
})();

const PORT = process.env.PORT || 5000;
const HOST = process.env.DB_HOST;

app.listen(PORT, async () => {
  try {
    /* await dbConection.sync( {alter: true}); */
    console.log(`The server is runing on port ${PORT}`);
    console.log(`http://${HOST}:${PORT}`);
    console.log(require('crypto').randomBytes(32).toString('hex'))
  } catch (error) {
    console.error("Error to syncronized to database:", error);
  }



  /* app.use( function (error, request, response, next){
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
 
});
