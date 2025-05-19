const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'meubanco',
  process.env.DB_USER || 'meuusuario',
  process.env.DB_PASSWORD || 'minhasenha',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
    dialect: 'mysql',
    logging: false,  // optional, set to true if you want SQL logs
  }
);

module.exports = sequelize;