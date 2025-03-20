const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Store = sequelize.define('Store', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lat: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    validate: {
      min: -90,
      max: 90
    }
  },
  long: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    validate: {
      min: -180,
      max: 180
    }
  }
}, {
  tableName: 'stores', // Specify the table name if it's different from the model name
  timestamps: false, // Disable timestamps (createdAt, updatedAt) if you don't need them
});

module.exports = Store;
