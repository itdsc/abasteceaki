const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
  nome: DataTypes.STRING,
  email: DataTypes.STRING,
  senha_hash: DataTypes.STRING,
  criado_em: DataTypes.DATE
}, {
  tableName: 'Usuario',
  timestamps: false
});

module.exports = Usuario;
