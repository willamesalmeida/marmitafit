const { Sequelize, DataTypes } = require("sequelize");
const conection = require("../config/database");

const Marmita = conection.define("Marmita", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  preco: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: conection.literal("CURRENT_TIMESTAMP"),
  },
  updateAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: conection.literal(
      "CURRENT_TIMESTAMP ON UPDTE CURRENT_TIMESTAMP"
    ),
  },
});

Marmita.associate = (models) => {
  Marmita.hasMany(models.ItemPedido, { foreignKey: "marmitaId" });
};

module.exports = Marmita;
