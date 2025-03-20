const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize) => {
  const Item = sequelize.define('Item', {
    Name: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    Price: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    TS: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });
  return Item;
};