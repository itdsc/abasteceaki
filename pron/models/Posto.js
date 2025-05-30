module.exports = (sequelize, DataTypes) => {
  const Posto = sequelize.define('Posto', {
    nome: DataTypes.STRING,
    endereco: DataTypes.STRING,
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE,
    criado_em: DataTypes.DATE
  });

  Posto.associate = (models) => {
    Posto.hasMany(models.Avaliacao, { foreignKey: 'posto_id' });
    Posto.hasMany(models.PrecoCombustivel, { foreignKey: 'posto_id' });
  };

  return Posto;
};
