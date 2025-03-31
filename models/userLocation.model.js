const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize) => {
  const User_Location = sequelize.define('User_Location', {
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
        key: 'id',
      },
    },
    user_loc: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: false,
    },
  }, {
    indexes: [
      {
        type: 'SPATIAL',
        fields: ['user_loc'],
      },
    ],
  });

  return User_Location;
};