const express = require('express');
const { sequelize } = require('./models');
const { QueryTypes } = require('sequelize');
const cors = require('cors');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', require('./routes'));

const criarUsuarioSQL = async () => {
  const nome = 'Admin';
  const email = 'admin@example.com';
  const senha = 'senhaSegura'; // Use environment variables or safer config in prod

  try {
    // Hash the password
    const senha_hash = await bcrypt.hash(senha, 10);

    // Use parameterized query to avoid injection
    const query = `
      INSERT INTO Usuario (nome, email, senha_hash, criado_em)
      VALUES (?, ?, ?, NOW());
    `;

    await sequelize.query(query, {
      replacements: [nome, email, senha_hash],
      type: QueryTypes.INSERT,
    });

    console.log('Usuário criado com sucesso!');
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
  }
};

sequelize.sync().then(async () => {
  // Uncomment only if you want to create the admin user once
  // await criarUsuarioSQL();

  app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
  });
});
