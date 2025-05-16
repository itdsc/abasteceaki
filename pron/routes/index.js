const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');
const usuarioController = require('../controllers/usuarioController');
const postoController = require('../controllers/postoController');


router.post('/login', authController.login);
router.post('/usuarios', usuarioController.create);
router.post('/posto', postoController.create);
router.get('/listarPostos', postoController.list);
router.post('/avaliar', postoController.createNote);
router.post('/addcombustivel', postoController.createCombustivel);

router.get('/', usuarioController.teste);
router.get('/usuarios', auth, usuarioController.list);
router.get('/usuarios/:id', auth, usuarioController.get);
router.put('/usuarios/:id', auth, usuarioController.update);
router.delete('/usuarios/:id', auth, usuarioController.delete);

router.get('/', (req, res) => {
  res.send('API funcionando!');
});

module.exports = router;
