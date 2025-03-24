const sequelize = require('../config/database');
const Product = require('./product.model');
const Store = require('./store.model');
const User = require('./user.model');
const Sequelize = require('sequelize');
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Products = require('./product.model')(sequelize, Sequelize);

module.exports = db;
