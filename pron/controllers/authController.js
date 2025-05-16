const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');
require('dotenv').config();


exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  const usuario = await Usuario.findOne({ where: { email } });
  
  if (!usuario) {
    return res.status(404).send('Usuário ou password inválidos');
  }

  if (!usuario.senha_hash) {
    return res.status(500).send('Hash da password não encontrado');
  }

  const match = await bcrypt.compare(password, usuario.senha_hash);

  if (!match) {
    return res.status(401).send('Usuário ou password inválidos');
  }

  const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
};
