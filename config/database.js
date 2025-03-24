const {Sequelize} = require("sequelize")
require("dotenv").config()

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_LOCAL_PORT,
    logging: process.env.APP_DEBUG ? console.log: false,
    dialect: "mysql",
    define : {
      timestamps: false,
      freezeTableName: true,
    }
  },
);

const database = async function connection() {

  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}
module.exports = database;