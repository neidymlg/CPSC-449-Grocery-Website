const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Store = sequelize.define(
    'Store',
    {
      ID: {
        type: DataTypes.STRING(8),
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
    },
    {
      tableName: 'Store', // Explicitly define the table name
      timestamps: false, // Disable timestamps
      indexes: [
        {
          type: 'SPATIAL',
          fields: ['geom_loc'], // Add spatial index for geom_loc
        },
      ],
    }
  );

  return Store;
};