const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize) => {
  const User_Location = sequelize.define('User_Location', {
    user_loc: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: false,
    },
  });
  return User_Location;
};