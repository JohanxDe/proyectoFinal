const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db/conection'); // conexión a PostgreSQL
const verificarToken = require('./middlewares/authMiddleware');
const usuariosRoutes = require('./routes/usuarios.routes'); // rutas de usuarios
const publicacionesRoutes = require('./routes/publicaciones.routes'); // Rutas de publicaciones
const favoritosRoutes = require('./routes/favoritos.routes'); // Rutas de favoritos

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/publicaciones', publicacionesRoutes)
app.use('/api/favoritos', verificarToken, favoritosRoutes)



// Ruta de prueba de conexión a la BD
app.get('/db-test', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ status: 'Conectado a PostgreSQL ✅', hora: result.rows[0].now });
  } catch (error) {
    console.error('Error en la conexión:', error);
    res.status(500).json({ status: 'Error en la conexión ❌' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
});
