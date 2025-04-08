const sequelize = require('../config/database');
const Sequelize = require('sequelize');
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Products = require('./product.model')(sequelize, Sequelize);
db.Store = require('./store.model')(sequelize, Sequelize);
db.Item = require('./item.model')(sequelize, Sequelize);
db.User_Order = require('./userOrder.model')(sequelize, Sequelize);
db.Orders = require('./orders.model')(sequelize, Sequelize);

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
  
module.exports = db;
