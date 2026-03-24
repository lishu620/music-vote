const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  nickname: { type: DataTypes.STRING, defaultValue: "用户" },
  role: {
    type: DataTypes.ENUM('文案','管理','播音','剪辑','美术','其他'),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'active'),
    defaultValue: 'pending',
    allowNull: false
  }
});

module.exports = User;