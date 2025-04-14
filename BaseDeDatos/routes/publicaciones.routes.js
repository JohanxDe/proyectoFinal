const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/authMiddleware');
const {
  obtenerPublicaciones,
  crearPublicacion,
  eliminarPublicacion,
  editarPublicacion,
  obtenerMisPublicaciones
} = require('../controllers/publicaciones.controller');

// Rutas
router.get('/', obtenerPublicaciones); 
router.post('/', verificarToken, crearPublicacion);
router.delete('/:id', verificarToken, eliminarPublicacion);
router.put('/:id', verificarToken, editarPublicacion);
router.get('/mias', verificarToken, obtenerMisPublicaciones);



module.exports = router;
