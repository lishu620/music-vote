const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const Episode = require('./Episode');
const Recommend = require('./Recommend');

const Vote = sequelize.define('Vote', {
  num: { type: DataTypes.INTEGER, allowNull: false },
  nickname: { type: DataTypes.STRING }
});

Vote.belongsTo(User);
Vote.belongsTo(Episode);
Vote.belongsTo(Recommend);

module.exports = Vote;