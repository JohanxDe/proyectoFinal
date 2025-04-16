const bcrypt = require('bcryptjs');
const pool = require('../db/conection');
const jwt = require('jsonwebtoken')
require('dotenv').config();

const registrarUsuario = async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  try {
    // Verificar si el email ya existe
    const existe = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

    if (existe.rows.length > 0) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insertar usuario
    const nuevoUsuario = await pool.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol, created_at',
      [nombre, email, hashedPassword, rol]
    );

    res.status(201).json(nuevoUsuario.rows[0]);
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};


const loginUsuario = async(req, res) => {
    const {email, password} = req.body;

    try{
        //Buscar usuario por email
        const resultado = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);

        if(resultado.rows.length === 0){
            return res.status(404).json({error: 'Usuario no encontrado'})
        }

        const usuario = resultado.rows[0];
        
        //comparar contraseñas
        const coincide = await bcrypt.compare(password, usuario.password);
        if(!coincide){
            return res.status(404).json({error: 'Usuario no encontrado'})
        }

        //generar token
        const payload = {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email,
          rol: usuario.rol
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        //Enviar respuesta sin la contraseña
        const{password: _, ...usuarioSinPassword} = usuario;

        res.json({
            token,
            usuario: usuarioSinPassword
        });
    }
    catch(error){
        console.error('Error en login', error);
        res.status(500).json({error: 'Error interno del servidor'})
    }
    
}

const obtenerPerfil = async (req, res) => {
  try {
    console.log('Usuario desde token:', req.usuario);
    const userId = req.user.id; // El ID viene desde el token verificado

    const result = await pool.query(
      'SELECT nombre, email, rol FROM usuarios WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ error: 'Error al obtener perfil del usuario' });
  }
};



module.exports = { 
    registrarUsuario,
    loginUsuario,
    obtenerPerfil

};
