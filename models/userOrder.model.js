const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize) => {
  const User_Order = sequelize.define('User_Order', {
    Item_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Item',
        key: 'ID',
      },
    },
    Store_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Item',
        key: 'Store_ID',
      },
    },
    Product_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Item',
        key: 'Product_ID',
      },
    },
    Order_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'Orders',
        key: 'ID',
      },
    },
    Quantity: {
      type: DataTypes.INTEGER,
      allowNull: false, // Ensure this field is required
    },
    Individual_Total: {
      type: DataTypes.DECIMAL(6, 2),
      allowNull: false, // Ensure this field is required
    },
  }, {
    tableName: 'User_Order', // Ensure the table name matches your database
    timestamps: false, // Disable timestamps if not needed
  });

  User_Order.associate = (models) => {
    User_Order.belongsTo(models.Item, { foreignKey: 'Item_ID' }); // Associate with Item  };
  };
  
  return User_Order;
};
