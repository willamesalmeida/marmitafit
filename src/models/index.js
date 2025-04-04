const { sequelize, Sequelize } = require("sequelize")
const conection = require("../config/database")

const sequelize = new Sequelize(conection);

const User = require("./User")(sequelize, Sequelize.DataTypes);
const Marmita = require("./Marmita")(sequelize, Sequelize.DataTypes);const Pedido = require("./Pedido")(sequelize, Sequelize.DataTypes);
const ItemPedido = require("./ItemPedido")(sequelize, Sequelize.DataTypes);

//Definindo os relacionamentos
User.hasMany(Pedido, { foreignKey: "userId" });
Pedido.belongsTo(User, { foreignKey: "userId" });

Pedido.hasMany(ItemPedido, { foreignKey: "pedidoId" });
ItemPedido.belongsTo(Pedido, { foreignKey: "pedidoId" });

Marmita.hasMany(ItemPedido, { foreignKey: "marmitaId" });
ItemPedido.belongsTo(Marmita, { foreignKey: "marmitaId" });

module.exports = { sequelize, User, Marmita, Pedido, ItemPedido };User.hasMany(Pedido, {foreignKey: "userId"})
