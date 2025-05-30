// Importa os modelos e utilitários necessários
const { Posto } = require('../models');
const { Avaliacao } = require('../models');
const { PrecoCombustivel } = require('../models');
const { Op, Sequelize } = require('sequelize');
const fetch = require('node-fetch'); // Importa fetch para chamadas HTTP externas

// Cria um novo posto com geocodificação automática a partir do endereço
exports.create = async (req, res) => {
  try {
    const { nome, endereco } = req.body;

    // Validação dos campos obrigatórios
    if (!nome || !endereco) {
      return res.status(400).json({ erro: 'Nome e endereço são obrigatórios' });
    }

    // Busca latitude e longitude usando Nominatim (OpenStreetMap)
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`);
    const data = await response.json();

    // Validação da resposta da API
    if (!data || data.length === 0) {
      return res.status(400).json({ erro: 'Endereço não encontrado' });
    }

    const latitude = parseFloat(data[0].lat);
    const longitude = parseFloat(data[0].lon);

    // Criação do posto com coordenadas
    const usuario = await Posto.create({ 
      nome, 
      endereco, 
      latitude,
      longitude,
      criado_em: new Date() 
    });

    res.json(usuario);

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao criar usuário' });
  }
};

// Lista todos os postos com média de avaliação e preços de combustíveis
exports.list = async (req, res) => {
  console.log('Adição de Ajustes');
  try {
    // Busca todos os postos com média de avaliação
    const postosComAvaliacoes = await Posto.findAll({
      include: [{ model: Avaliacao, attributes: [] }],
      attributes: {
        include: [
          [Sequelize.fn('AVG', Sequelize.col('Avaliacaos.nota')), 'media_avaliacao']
        ]
      },
      group: ['Posto.id'],
      raw: true
    });

    // Extrai IDs dos postos
    const postoIds = postosComAvaliacoes.map(posto => posto.id);

    // Busca todos os preços de combustíveis para os postos
    const combustiveis = await PrecoCombustivel.findAll({
      where: { posto_id: postoIds },
      raw: true
    });

    // Agrupa combustíveis por posto
    const combustiveisPorPosto = combustiveis.reduce((acc, comb) => {
      const postoId = comb.posto_id;
      acc[postoId] = acc[postoId] || [];
      acc[postoId].push({
        nome: comb.nome,
        preco: comb.preco,
        atualizado_em: comb.atualizado_em
      });
      return acc;
    }, {});

    // Adiciona os combustíveis ao resultado
    const resultado = postosComAvaliacoes.map(posto => ({
      ...posto,
      combustiveis: combustiveisPorPosto[posto.id] || []
    }));

    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao obter postos e avaliações' });
  }
};

// Cria uma nova avaliação (nota) para um posto
exports.createNote = async (req, res) => {
  try {
    console.log(req.body);
    const { usuario_id, posto_id, nota } = req.body;

    // Validação dos campos obrigatórios
    if (!usuario_id || !posto_id || !nota) {
      return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
    }

    // Criação da avaliação
    const avaliacao = await Avaliacao.create({ 
      usuario_id, 
      posto_id, 
      nota,
      criado_em: new Date() 
    });

    res.json(avaliacao);

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao avaliar.' });
  }
};

// Retorna a média de notas de um posto específico
exports.devolverNota = async (req, res) => {
  try {
    const { posto_id } = req.query;

    if (!posto_id) {
      return res.status(400).json({ erro: 'ID do posto é obrigatório' });
    }

    // Calcula a média das notas do posto
    const media = await Avaliacao.findOne({
      where: { posto_id },
      attributes: [[Sequelize.fn('AVG', Sequelize.col('nota')), 'media_nota']],
      raw: true
    });

    res.json(media);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao obter nota média do posto' });
  }
};

// Cria um novo registro de combustível para um posto
exports.createCombustivel = async (req, res) => {
  try {
    const { posto_id, nome, preco } = req.body;

    // Validação dos campos obrigatórios
    if (!posto_id || !nome || !preco) {
      return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
    }

    // Criação do registro de combustível
    const usuario = await PrecoCombustivel.create({ 
      nome, 
      preco, 
      posto_id,
      criado_em: new Date() 
    });

    res.json(usuario);

  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao criar preço' });
  }
};

// Busca postos próximos com base na localização e raio
exports.getNearby = async (req, res) => {
  const { lat, lng } = req.query;
  const raio = 50000; // Raio fixo de 50 km para cidade grande

  // Validação dos parâmetros obrigatórios
  if (!lat || !lng) {
    return res.status(400).json({ erro: 'Latitude e longitude são obrigatórias' });
  }

  try {
    // Busca os postos dentro do raio fornecido usando a função ST_Distance_Sphere do MySQL
    const postos = await Posto.findAll({
      where: Sequelize.where(
        Sequelize.fn(
          'ST_Distance_Sphere',
          Sequelize.literal('point(longitude, latitude)'),
          Sequelize.literal(`point(${lng}, ${lat})`)
        ),
        { [Op.lte]: raio }
      ),
      attributes: ['id', 'nome', 'latitude', 'longitude']
    });

    res.json(postos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar postos próximos' });
  }
};
