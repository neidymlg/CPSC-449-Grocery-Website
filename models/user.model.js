const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust path if needed

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  googleId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensure Google IDs are unique
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Ensure emails are unique (optional, depending on your needs)
    validate: {
      isEmail: true,
    },
  },
  // Add other fields as needed (e.g., address, phone number, etc.)
}, {
  tableName: 'users', // Specify table name if different
  timestamps: true, // Enable timestamps for tracking creation and updates
});

module.exports = User;
