const { Sequelize,  DataTypes } = require("sequelize");
const conection = require("../config/database");

const Pedido = sequelize.define("Pedido", {

  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
    onDelete: "CASCADE",
  },

  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "pendente",
  },

  total: {
    types: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },

  createdAt: {
    type: Data.DataTypes.DATA,
    allowNull: false,
    defaultValue: conection.literal("CURRENT_TIMESTAMP"),
  },
  
  updatedAt: {
    type: DataTypes.DATA,
    allowNull: false,
    defaultValue: conection.literal(
      "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
    ),
  },
});

Pedido.associate = (models) => {
  Pedido.belongsTo(models.User, {
    foreignKey: "userId"
  });
  Pedido.hasMany(modeles.ItemPedido, { foreignKey: "pedidoId"});
};

module.exports = Pedido;
