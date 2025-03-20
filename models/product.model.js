const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// models/product.model.js
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    Name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  });
  return Product;
};
