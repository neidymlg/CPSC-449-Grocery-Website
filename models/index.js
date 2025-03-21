const sequelize = require('../config/database');
const Sequelize = require('sequelize');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// db.Product = require('./product.model')(sequelize, Sequelize);
// db.Store = require('./store.model')(sequelize, Sequelize);
db.Item = require('./item.model')(sequelize, Sequelize);
// db.User = require('./user.model')(sequelize, Sequelize);
// db.Order = require('./order.model')(sequelize, Sequelize);
// db.User_Order = require('./user_order.model')(sequelize, Sequelize);
// db.User_Location = require('./user_location.model')(sequelize, Sequelize);

module.exports = db;