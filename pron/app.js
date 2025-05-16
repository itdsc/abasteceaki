const express = require('express');
const { sequelize } = require('./models');
const { QueryTypes } = require('sequelize');
const cors = require('cors');
const app = express();

require('dotenv').config();

app.use(express.json());
app.use(cors());

app.use('/api', require('./routes'));

const criarUsuarioSQL = async () => {
  const nome = 'Admin';
  const email = 'admin@example.com';
  const senha = 'senhaSegura'; // Substitua com a senha real

  // Gerar o hash da senha
  const bcrypt = require('bcrypt');
  const senha_hash = await bcrypt.hash(senha, 10);

  const query = `
    INSERT INTO Usuario (nome, email, senha_hash, criado_em)
    VALUES ('${nome}', '${email}', '${senha_hash}', NOW());
  `;

  try {
    await sequelize.query(query, { type: QueryTypes.INSERT });
    console.log('Usuário criado com sucesso!');
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
  }
};

sequelize.sync().then(() => {
  //criarUsuarioSQL()
  app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
  });
});
