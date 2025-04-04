const { Sequelize, DataTypes} = require("sequelize")
const conection = require("../config/database")


const ItemPedido =  sequelize.define("ItemPedido", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true
  },
  PedidoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Pedido",
      key: "id",
    },
  onDelete: "CASCADE",
  },
  marmitaId: {
    type: DataType.INTEGER,
    allowNull: false,
    references: {
      model: "Marmitas",
      key: "id",
    },
  onDelete: "CASCADE",
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  subtotal: {
    type: DataTypes.DECIMAL,
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

ItemPedido.associate = (models) => {
  ItemPedido.belongsTo(models.Pedido, { foreignKey: "pedidoId"});
  ItemPedido.belongsTo(models.Marmita, {foreignKey: "marmitaId"});
};


module.exports = ItemPedido;