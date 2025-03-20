// config/database.js
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("Grocery", "root", "root", {
  host: "127.0.0.1",
  port: 3307,
  dialect: "mysql",
  logging: console.log, // Set to false to disable logging
});

module.exports = sequelize;
