const jwt = require('jsonwebtoken');
require('dotenv').config();

function auth(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).send('Token não fornecido');

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).send('Token inválido');
    req.usuarioId = decoded.id;
    next();
  });
}

module.exports = auth;
