const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Episode = require('./Episode');

const Recommend = sequelize.define('Recommend', {
  type: { type: DataTypes.ENUM('netease','bilibili'), allowNull: false },
  link: { type: DataTypes.STRING, allowNull: false },
  reason: { type: DataTypes.TEXT, allowNull: false },
  nickname: { type: DataTypes.STRING },
  voteCount: { type: DataTypes.INTEGER, defaultValue: 0 }
});

Recommend.belongsTo(User);
Recommend.belongsTo(Episode);

module.exports = Recommend;