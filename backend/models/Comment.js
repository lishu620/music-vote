const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comment = sequelize.define('Comment', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  nickname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  RecommendId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

module.exports = Comment;