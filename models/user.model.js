const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Adjust path if needed

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      Email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      Password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "User",
      timestamps: false, // Enable timestamps for tracking creation and updates
    }
  );

  return User; // Ensure the model is returned
};