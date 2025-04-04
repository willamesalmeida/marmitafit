const { Sequelize,  DataTypes } = require("sequelize");
const conection = require("../config/database");


const User = conection.define("User", {
  id: {
    type: DataTypes.INTEGER,
    primarykey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.SMALLINT,
    allowNull: fasle,
    unique: true,
  },
  senha: {
    types: DataTypes.STRING,
    allowNull: fasle,
  },
  createdAt: {
    type: Data.DataTypes.DATA,
    allowNull: false,
    defaultValue: conection.literal("CURRENT_TIMESTAMP"),
  },
  updatedAt: {
    type: DataTypes.DATA,
    allowNull: false,
    defaultValue: conection.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
  },
});
User.associate = (models) => {
  User.hasMany(models.Pedido, {foreignKey: "userId"})
};

module.exports = User;
