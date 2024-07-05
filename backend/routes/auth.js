const express = require('express');
const authController = require('../controllers/auth_controller');
const verifyJWT = require('../middlewares/auth_token');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/protected', verifyJWT, (req, res) => {
  res.status(200).send('Acesso concedido à rota protegida.');
});

module.exports = router;
