// Carrega a instância do Sequelize com base nas variáveis de ambiente
const sequelize = require('../config/database');

// Importa os modelos
const Usuario = require('./Usuario');
const Avaliacao = require('./Avaliacao');
const Posto = require('./Posto');
const PrecoCombustivel = require('./PrecoCombustivel');
const Combustivel = require('./Combustivel');

// Define os relacionamentos entre os modelos

// Um usuário pode ter várias avaliações
Usuario.hasMany(Avaliacao, { foreignKey: 'usuario_id', onDelete: 'CASCADE' });
Avaliacao.belongsTo(Usuario, { foreignKey: 'usuario_id' });

// Um posto pode ter várias avaliações
Posto.hasMany(Avaliacao, { foreignKey: 'posto_id', onDelete: 'CASCADE' });
Avaliacao.belongsTo(Posto, { foreignKey: 'posto_id' });

// Um posto pode ter vários preços de combustíveis
Posto.hasMany(PrecoCombustivel, { foreignKey: 'posto_id', onDelete: 'CASCADE' });
PrecoCombustivel.belongsTo(Posto, { foreignKey: 'posto_id' });

// Um PrecoCombustivel deve estar vinculado a um tipo de combustível
Combustivel.hasMany(PrecoCombustivel, { foreignKey: 'combustivel_id', onDelete: 'CASCADE' });
PrecoCombustivel.belongsTo(Combustivel, { foreignKey: 'combustivel_id' });

// Exporta todos os modelos e a instância do Sequelize
module.exports = {
  sequelize,
  Usuario,
  Avaliacao,
  Posto,
  PrecoCombustivel,
  Combustivel,
};
