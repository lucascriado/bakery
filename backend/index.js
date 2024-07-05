const express = require('express');
const sequelize = require('./config/database_config');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173' // Ou use '*' para permitir todas as origens
}));

const authRoutes = require('./routes/auth');
app.use('/', authRoutes);

const port = process.env.PORT || 3000;

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
