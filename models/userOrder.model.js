const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize) => {
  const User_Order = sequelize.define('User_Order', {
    Item_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Item',
        key: 'ID',
      },
    },
    Store_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Item',
        key: 'Store_ID',
      },
    },
    Product_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Item',
        key: 'Product_ID',
      },
    },
    Order_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Order', // Ensure the table name matches your database
        key: 'ID',
      },
    },
  }, {
    tableName: 'User_Order',
    timestamps: false,
  });

  return User_Order;
};