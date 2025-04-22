const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path as necessary

module.exports = (sequelize) => {
  const Item = sequelize.define('Item', {
    ID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    Store_ID: {
      type: DataTypes.STRING(8),
      allowNull: false,
      references: {
        model: 'Store',
        key: 'ID',
      },
    },
    Product_ID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Product',
        key: 'ID',
      },
    },
    Name: {
      type: DataTypes.STRING(30),
      allowNull: false,
      unique: 'compositeIndex',
    },
    Price: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: false,
    },
    TS: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    indexes: [
      {
        unique: true,
        fields: ['Store_ID', 'Product_ID', 'Name'],
        name: 'compositeIndex',
      },
    ],
    tableName: 'Item',
    timestamps: false,
  });

  Item.associate = (models) => {
    Item.belongsTo(models.Store, { foreignKey: 'Store_ID' }); // Associate with Store
    Item.hasMany(models.User_Order, { foreignKey: 'Item_ID' }); // Associate with User_Order
  };
  
  return Item;
};