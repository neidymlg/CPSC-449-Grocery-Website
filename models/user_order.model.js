const sequelize = require('../config/database');

module.exports = (sequelize) => {
    const User_Order = sequelize.define('User_Order', {});
    return User_Order;
  };