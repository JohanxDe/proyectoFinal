const pool = require('../db/conection');

// Obtener todas las publicaciones
const obtenerPublicaciones = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM publicaciones ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener publicaciones:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
};

// Crear publicación
const crearPublicacion = async (req, res) => {
  const { titulo, descripcion, imagen_url } = req.body;
  const usuario_id = req.user.id; // Viene del token verificado

  try {
    const result = await pool.query(
      'INSERT INTO publicaciones (titulo, descripcion, imagen_url, usuario_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [titulo, descripcion, imagen_url, usuario_id]
    );
    res.status(201).json(result.rows[0]); // Respuesta con la publicación creada
  } catch (error) {
    console.error('Error al crear publicación:', error);
    res.status(500).json({ mensaje: 'Error al crear publicación' });
  }
};


// Eliminar publicación
const eliminarPublicacion = async (req, res) => {
    const { id } = req.params;
    const usuarioId = req.user.id;
  
    try {
      // Verificar que la publicación le pertenece al usuario
      const resultado = await pool.query('SELECT * FROM publicaciones WHERE id = $1', [id]);
  
      if (resultado.rowCount === 0) {
        return res.status(404).json({ mensaje: 'Publicación no encontrada' });
      }
  
      const publicacion = resultado.rows[0];
  
      if (publicacion.usuario_id !== usuarioId) {
        return res.status(403).json({ mensaje: 'No tienes permiso para eliminar esta publicación' });
      }
  
      await pool.query('DELETE FROM publicaciones WHERE id = $1', [id]);
  
      res.json({ mensaje: 'Publicación eliminada con éxito' });
    } catch (error) {
      console.error('Error al eliminar publicación:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

// Editar publicación
const editarPublicacion = async (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion, imagen_url } = req.body;
    const usuarioId = req.user.id;
  
    try {
      // Verificar que la publicación le pertenece al usuario
      const resultado = await pool.query('SELECT * FROM publicaciones WHERE id = $1', [id]);
  
      if (resultado.rowCount === 0) {
        return res.status(404).json({ mensaje: 'Publicación no encontrada' });
      }
  
      const publicacion = resultado.rows[0];
  
      if (publicacion.usuario_id !== usuarioId) {
        return res.status(403).json({ mensaje: 'No tienes permiso para editar esta publicación' });
      }
  
      const actualizada = await pool.query(
        'UPDATE publicaciones SET titulo = $1, descripcion = $2, imagen_url = $3 WHERE id = $4 RETURNING *',
        [titulo, descripcion, imagen_url, id]
      );
  
      res.json(actualizada.rows[0]);
    } catch (error) {
      console.error('Error al editar publicación:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };


const obtenerMisPublicaciones = async (req, res) => {
  try {
    const userId = req.user.id; // Viene del token ya verificado
    const resultado = await pool.query(
      'SELECT id, titulo, created_at FROM publicaciones WHERE usuario_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(resultado.rows);
  } catch (err) {
    console.error('Error en obtenerMisPublicaciones:', err);
    res.status(500).json({ message: 'Error al obtener tus publicaciones' });
  }
};

module.exports = {
  obtenerPublicaciones,
  crearPublicacion,
  eliminarPublicacion,
  editarPublicacion,
  obtenerMisPublicaciones
};
