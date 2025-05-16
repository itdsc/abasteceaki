const sequelize = require('../config/database');
const Usuario = require('./Usuario');
const Avaliacao = require('./Avaliacao');
const Posto = require('./Posto');
const PrecoCombustivel = require('./PrecoCombustivel');
const Combustivel = require('./Combustivel');

Usuario.hasMany(Avaliacao, { foreignKey: 'usuario_id' });
Avaliacao.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Posto.hasMany(Avaliacao, { foreignKey: 'posto_id' });
Avaliacao.belongsTo(Posto, { foreignKey: 'posto_id' });

Posto.hasMany(PrecoCombustivel, { foreignKey: 'posto_id' });
PrecoCombustivel.belongsTo(Posto, { foreignKey: 'posto_id' });

module.exports = {
  sequelize,
  Usuario,
  Avaliacao,
  Posto,
  PrecoCombustivel,
  Combustivel
};
