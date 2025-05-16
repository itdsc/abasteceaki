const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Avaliacao = sequelize.define('Avaliacao', {
  usuario_id: DataTypes.INTEGER,
  posto_id: DataTypes.INTEGER,
  nota: DataTypes.INTEGER,
  criado_em: DataTypes.DATE
}, {
  tableName: 'Avaliacao',
  timestamps: false
});

module.exports = Avaliacao;
