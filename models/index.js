const sequelize = require('../config/database');
const Product = require('./product.model');
const Store = require('./store.model');

const db = {};

db.Sequelize = require('sequelize');
db.sequelize = sequelize;

db.products = Product;

module.exports = db;
