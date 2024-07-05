// Dependências
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Configuração do servidor
const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

// Conexão com o Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  dialect: 'mysql'
});

// Modelo User
const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // Opções
});

// Rota de registro
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  try {
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 86400 });
    res.status(201).send({ auth: true, token });
  } catch (error) {
    console.log(error);
    return res.status(500).send('Erro no servidor');
  }
});

// Rota de login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).send({ auth: false, token: null });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: 86400 });
    res.status(200).send({ auth: true, token });
  } catch (error) {
    return res.status(500).send('Erro no servidor');
  }
});

// Middleware de autenticação
function verifyJWT(req, res, next) {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(403).send({ auth: false, message: 'Nenhum token fornecido.' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(500).send({ auth: false, message: 'Falha ao autenticar o token.' });
    req.userId = decoded.id;
    next();
  });
}

// Rota protegida
app.get('/protected', verifyJWT, (req, res) => {
  res.status(200).send('Acesso concedido à rota protegida.');
});

// Sincronizar modelos e iniciar o servidor
(async () => {
  try {
    await sequelize.sync({ alter: true });
    app.listen(port, () => {
      console.log(`Servidor rodando na porta ${port}`);
    });
  } catch (error) {
    console.error('Erro ao sincronizar com o banco de dados:', error);
  }
})();
