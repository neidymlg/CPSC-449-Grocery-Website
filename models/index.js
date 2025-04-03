const sequelize = require('../config/database');
const User = require('./user.model');
const Sequelize = require('sequelize');
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Products = require('./product.model')(sequelize, Sequelize);
db.Store = require('./store.model')(sequelize, Sequelize);
db.Item = require('./item.model')(sequelize, Sequelize);


module.exports = db;
