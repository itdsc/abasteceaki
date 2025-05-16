const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Posto = sequelize.define('Posto', {
  nome: DataTypes.STRING,
  endereco: DataTypes.STRING,
  latitude: DataTypes.STRING,
  longitude: DataTypes.STRING,
  criado_em: DataTypes.DATE
}, {
  tableName: 'Posto',
  timestamps: false
});

module.exports = Posto;
