const { Usuario } = require('../models');
const bcrypt = require('bcrypt');

exports.create = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Todos os campos são obrigatórios' });
    }

    const usuarioExistente = await Usuario.findOne({ where: { email } });
    
    if (usuarioExistente) {
      return res.status(409).json({ erro: 'Este e-mail já está em uso' });
    }
    const senha_hash = await bcrypt.hash(senha, 10);

    const usuario = await Usuario.create({ 
      nome, 
      email, 
      senha_hash, 
      criado_em: new Date() 
    });

    res.json(usuario);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao criar usuário' });
  }
};


exports.teste = async (req, res) => {
  res.send('<h1>Deu certo!</h1>');
};

exports.list = async (req, res) => {
  const usuarios = await Usuario.findAll();
  res.json(usuarios);
};

exports.get = async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id);
  res.json(usuario);
};

exports.update = async (req, res) => {
  const { nome, email } = req.body;
  await Usuario.update({ nome, email }, { where: { id: req.params.id } });
  res.send('Usuário atualizado');
};

exports.delete = async (req, res) => {
  await Usuario.destroy({ where: { id: req.params.id } });
  res.send('Usuário deletado');
};
