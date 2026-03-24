const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Episode = sequelize.define('Episode', {
  name: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  status: { 
    type: DataTypes.ENUM('submit', 'vote', 'archive'), 
    defaultValue: 'submit' 
  }
});

module.exports = Episode;