const sequelize = require('../config/database');
const Product = require('./product.model');
const Store = require('./store.model');
const Item = require('./item.model');
const Order = require('./order.model');
const User_Order = require('./user_order.model');
const User_Location = require('./user_location.model');
const User = require('./user.model');

const db = {};

db.Sequelize = require('sequelize');
db.sequelize = sequelize;

db.products = Product;
db.stores = Store;
db.users = User;
db.items = Item;
db.orders = Order;
db.user_orders = User_Order;
db.user_locations = User_Location;


db.stores.hasMany(db.items, { foreignKey: 'Store_ID' }); 
db.products.hasMany(db.items, { foreignKey: 'Product_ID' });
db.items.belongsTo(db.stores, { foreignKey: 'Store_ID' });
db.items.belongsTo(db.products, { foreignKey: 'Product_ID' });
db.users.hasMany(db.orders, { foreignKey: 'User_ID' });
db.orders.belongsTo(db.users, { foreignKey: 'User_ID' });
db.items.belongsToMany(db.orders, { through: db.user_orders, foreignKey: 'Item_ID', otherKey: 'Order_ID' });
db.orders.belongsToMany(db.items, { through: db.user_orders, foreignKey: 'Order_ID', otherKey: 'Item_ID' });
db.users.hasOne(db.user_locations, { foreignKey: 'User_ID' });
db.user_locations.belongsTo(db.users, { foreignKey: 'User_ID' });

module.exports = db;
