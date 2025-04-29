const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../index');

// Crear usuario
// Status: Deshabilitada la creación de usuarios desde este endpoint.  La creación de usuarios ahora se maneja a través de /register en auth.js
// router.post('/', async (req, res) => {
//   try {
//     const { first_name, last_name, email, employee_number, role, password } = req.body;

//     // Verificar si el usuario ya existe
//     const userExists = await pool.query(
//       'SELECT * FROM users WHERE email = $1 OR employee_number = $2',
//       [email, employee_number]
//     );

//     if (userExists.rows.length > 0) {
//       return res.status(400).json({
//         mensaje: 'El correo o número de empleado ya está registrado'
//       });
//     }

//     // Encriptar contraseña
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Crear nuevo usuario
//     const newUser = await pool.query(
//       'INSERT INTO users (first_name, last_name, email, employee_number, role, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, first_name, last_name, email, employee_number, role, created_at',
//       [first_name, last_name, email, employee_number, role, hashedPassword]
//     );

//     res.status(201).json(newUser.rows[0]);
//   } catch (error) {
//     console.error('Error al crear usuario:', error);
//     res.status(500).json({
//       mensaje: 'Error al crear el usuario',
//       error: error.message
//     });
//   }
// });

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await pool.query(
      'SELECT id, first_name, last_name, email, employee_number, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(usuarios.rows);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener usuarios',
      error: error.message
    });
  }
});

// Obtener usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await pool.query(
      'SELECT id, first_name, last_name, email, employee_number, role, created_at FROM users WHERE id = $1',
      [id]
    );

    if (usuario.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json(usuario.rows[0]);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener el usuario',
      error: error.message
    });
  }
});

// Actualizar usuario
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, employee_number, role } = req.body;

    // Verificar si el usuario existe
    const usuarioExiste = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

    if (usuarioExiste.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Verificar si el correo o número de empleado ya existe en otro usuario
    const duplicado = await pool.query(
      'SELECT * FROM users WHERE (email = $1 OR employee_number = $2) AND id != $3',
      [email, employee_number, id]
    );

    if (duplicado.rows.length > 0) {
      return res.status(400).json({
        mensaje: 'El correo o número de empleado ya está registrado por otro usuario'
      });
    }

    const usuario = await pool.query(
      'UPDATE users SET first_name = $1, last_name = $2, email = $3, employee_number = $4, role = $5 WHERE id = $6 RETURNING id, first_name, last_name, email, employee_number, role, created_at',
      [first_name, last_name, email, employee_number, role, id]
    );

    res.json(usuario.rows[0]);
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al actualizar el usuario',
      error: error.message
    });
  }
});

// Eliminar usuario
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al eliminar el usuario',
      error: error.message
    });
  }
});

// Status: Se verificó que la creación de usuarios es posible desde este endpoint.
module.exports = router;
