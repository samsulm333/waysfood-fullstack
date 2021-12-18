"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      order.belongsTo(models.user, {
        as: "userOrder",
        foreignKey: {
          name: "buyyer_id",
        },
      });
      order.belongsTo(models.user, {
        as: "seller",
        foreignKey: {
          name: "seller_id",
        },
      }),
        order.hasMany(models.order_detail, {
          as: "orderItems",
          foreignKey: {
            name: "order_id",
          },
        });
    }
  }
  order.init(
    {
      buyyer_id: DataTypes.INTEGER,
      seller_id: DataTypes.INTEGER,
      subtotal: DataTypes.INTEGER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "order",
    }
  );
  return order;
};
