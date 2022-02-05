const Sequelize = require('sequelize');
const env = process.env.NODE_DEV || 'development';
const config = require('../config/config')[env];
const User = require('./user');
const StayContent = require('./stayContent');
const StayHistory = require('./stayHistory');

const db = {};
const sequelize = new Sequelize(
    config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.User = User;
db.StayContent = StayContent;
db.StayHistory = StayHistory;

User.init(sequelize);
StayContent.init(sequelize);
StayHistory.init(sequelize);

module.exports = db;