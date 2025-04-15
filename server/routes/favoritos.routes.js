const express = require('express');
const router = express.Router();
const verificarToken = require('../middlewares/authMiddleware');
const pool = require('../db/conection');

// Marcar como favorito
router.post('/:id', verificarToken, async (req, res) => {
  const publicacion_id = req.params.id;
  const usuario_id = req.user.id;

  try {
    const result = await pool.query(
      'INSERT INTO favoritos (usuario_id, publicacion_id) VALUES ($1, $2) RETURNING *',
      [usuario_id, publicacion_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al marcar favorito' });
  }
});


// Obtener favoritos del usuario
router.get('/', verificarToken, async (req, res) => {
  const usuario_id = req.user.id;

  try {
    const result = await pool.query(
      'SELECT * FROM favoritos WHERE usuario_id = $1',
      [usuario_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ mensaje: 'Error al obtener favoritos' });
  }
});


// Desmarcar como favorito
router.delete('/:id', verificarToken, async (req, res) => {
  const publicacion_id = req.params.id;
  const usuario_id = req.user.id;

  try {
    // Eliminamos el registro de la tabla favoritos
    const result = await pool.query(
      'DELETE FROM favoritos WHERE usuario_id = $1 AND publicacion_id = $2 RETURNING *',
      [usuario_id, publicacion_id]
    );

    // Si no se eliminó ningún registro, significa que no estaba marcado como favorito
    if (result.rowCount === 0) {
      return res.status(400).json({ mensaje: 'No has marcado esta publicación como favorita.' });
    }

    res.json({ mensaje: 'Publicación desmarcada como favorita.' });
  } catch (err) {
    console.error('Error al desmarcar favorito:', err);
    res.status(500).json({ mensaje: 'Error al desmarcar favorito' });
  }
});

module.exports = router;
