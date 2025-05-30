const { Posto } = require('../models');
const { Avaliacao } = require('../models');
const { PrecoCombustivel } = require('../models');
const { Op, Sequelize  } = require('sequelize');

exports.create = async (req, res) => {
  try {
    const { nome, endereco, latitude, longitude } = req.body;

    if (!nome || !latitude || !longitude || !endereco) {
      return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
    }

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

exports.list = async (req, res) => {
  console.log('adicao de ajustse')
  try {
    const postosComAvaliacoes = await Posto.findAll({
      include: [{
        model: Avaliacao,
        attributes: []
      }],
      attributes: {
        include: [
          [Sequelize.fn('AVG', Sequelize.col('Avaliacaos.nota')), 'media_avaliacao']
        ]
      },
      group: ['Posto.id'],
      raw: true
    });

    const postoIds = postosComAvaliacoes.map(posto => posto.id);

    const combustiveis = await PrecoCombustivel.findAll({
      where: { posto_id: postoIds },
      raw: true
    });

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

exports.createNote = async (req, res) => {
  try {
    console.log(req.body)
    const { usuario_id, posto_id, nota } = req.body;

    if (!usuario_id || !posto_id || !nota) {
      return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
    }

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

exports.devolverNota = async (req, res) => {
  const postos = await Posto.findAll();

  const postoExistente = await Avaliacao.findAll({ where: { id: posto_id } });

  res.json(postos);
};

exports.createCombustivel = async (req, res) => {
  try {
    const { posto_id, nome, preco } = req.body;

    if (!posto_id || !nome || !preco) {
      return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
    }

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

// ✅ New: Buscar postos próximos via latitude/longitude/raio
exports.getNearby = async (req, res) => {
  const { lat, lng, raio } = req.query;

  if (!lat || !lng || !raio) {
    return res.status(400).json({ erro: 'Latitude, longitude e raio são obrigatórios' });
  }

  try {
    const postos = await Posto.findAll({
      where: Sequelize.where(
        Sequelize.fn(
          'ST_Distance_Sphere',
          Sequelize.literal('point(longitude, latitude)'),
          Sequelize.literal(`point(${lng}, ${lat})`)
        ),
        { [Op.lte]: parseFloat(raio) }
      ),
      attributes: ['id', 'nome', 'latitude', 'longitude']
    });

    res.json(postos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar postos próximos' });
  }
};
