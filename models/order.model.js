const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize) => {
  const Orders = sequelize.define('Orders', {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    User_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'ID',
      },
    },
    Total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  });

  return Orders;
};