const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PrecoCombustivel = sequelize.define('PrecoCombustivel', {
  posto_id: DataTypes.INTEGER,
  nome: DataTypes.STRING,
  preco: DataTypes.STRING,
  atualizado_em: DataTypes.DATE
}, {
  tableName: 'PrecoCombustivel',
  timestamps: false
});

module.exports = PrecoCombustivel;
