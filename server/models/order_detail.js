"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class order_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      order_detail.belongsTo(models.order, {
        as: "transaction",
        foreignKey: {
          name: "order_id",
        },
      });
      order_detail.belongsTo(models.product, {
        as: "order",
        foreignKey: {
          name: "product_id",
        },
      });
    }
  }
  order_detail.init(
    {
      order_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      qty: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "order_detail",
    }
  );
  return order_detail;
};
