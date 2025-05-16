const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Combustivel = sequelize.define('Combustivel', {
  nome: DataTypes.STRING,
  descricao: DataTypes.STRING
}, {
  tableName: 'Combustivel',
  timestamps: false
});

module.exports = Combustivel;
