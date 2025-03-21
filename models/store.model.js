const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize) => {
  const Store = sequelize.define('Store', {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    geom_loc: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: false,
    },
    Name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
  }, {
    indexes: [
      {
        type: 'SPATIAL',
        fields: ['geom_loc'],
      },
    ],
  });

  return Store;
};