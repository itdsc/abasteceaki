const express = require('express');
const { sequelize } = require('./models');
const { QueryTypes } = require('sequelize');
const cors = require('cors');
const bcrypt = require('bcrypt');
const axios = require('axios'); // Para fazer as requisições HTTP
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api', require('./routes'));

// Função para obter latitude e longitude via geocoding (OpenStreetMap)
const obterCoordenadas = async (endereco) => {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(endereco)}&format=json&addressdetails=1&limit=1`;
    const response = await axios.get(url);

    if (response.data && response.data.length > 0) {
      const { lat, lon } = response.data[0];
      return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
    }

    throw new Error('Endereço não encontrado');
  } catch (error) {
    console.error('Erro ao buscar coordenadas:', error);
    throw error;
  }
};

// Função para criar um mock de usuário
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

// Função para buscar postos de combustível em Campina Grande
const obterPostosCampinaGrande = async () => {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=posto+combustivel+Campina+Grande&format=json&addressdetails=1&limit=50`;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar postos de combustível:', error);
    throw error;
  }
};

// Função para inserir postos no banco de dados
const criarPostosCampinaGrande = async () => {
  const postos = await obterPostosCampinaGrande();

  for (const posto of postos) {
    const { lat, lon, display_name } = posto;

    // Adiciona o posto no banco de dados
    try {
      const query = `
        INSERT INTO Posto (nome, endereco, latitude, longitude, criado_em)
        VALUES (?, ?, ?, ?, NOW());
      `;

      await sequelize.query(query, {
        replacements: [display_name, display_name, parseFloat(lat), parseFloat(lon)],
        type: QueryTypes.INSERT,
      });

      console.log(`Posto "${display_name}" criado com sucesso!`);
    } catch (error) {
      console.error('Erro ao criar posto:', error);
    }
  }
};

// Sincronizar e criar o mock de dados
sequelize.sync().then(async () => {
  // Criar um usuário mock
  await criarUsuarioSQL();

  // Criar postos de combustível de Campina Grande
  await criarPostosCampinaGrande();

  app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
  });
});
