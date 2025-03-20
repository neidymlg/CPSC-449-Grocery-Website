const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize) => {
  const Store = sequelize.define('Store', {
    geom_loc: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: false,
    },
    Name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  });
  return Store;
};