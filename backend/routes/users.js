const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const pool = require('../config/db');

// Crear usuario
router.post('/', async (req, res) => {
  try {
    const { nombre, apellido, correo, numero_empleado, cargo, password } = req.body;

    // Verificar si el usuario ya existe
    const userExists = await pool.query(
      'SELECT * FROM users WHERE correo = $1 OR numero_empleado = $2',
      [correo, numero_empleado]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({
        mensaje: 'El correo o número de empleado ya está registrado'
      });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear nuevo usuario
    const newUser = await pool.query(
      'INSERT INTO users (nombre, apellido, correo, numero_empleado, cargo, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, nombre, apellido, correo, numero_empleado, cargo, created_at',
      [nombre, apellido, correo, numero_empleado, cargo, hashedPassword]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({
      mensaje: 'Error al crear el usuario',
      error: error.message
    });
  }
});

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await pool.query(
      'SELECT id, nombre, apellido, correo, numero_empleado, cargo, created_at FROM users ORDER BY created_at DESC'
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
      'SELECT id, nombre, apellido, correo, numero_empleado, cargo, created_at FROM users WHERE id = $1',
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
    const { nombre, apellido, correo, numero_empleado, cargo } = req.body;

    // Verificar si el usuario existe
    const usuarioExiste = await pool.query('SELECT * FROM users WHERE id = $1', [id]);

    if (usuarioExiste.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Verificar si el correo o número de empleado ya existe en otro usuario
    const duplicado = await pool.query(
      'SELECT * FROM users WHERE (correo = $1 OR numero_empleado = $2) AND id != $3',
      [correo, numero_empleado, id]
    );

    if (duplicado.rows.length > 0) {
      return res.status(400).json({
        mensaje: 'El correo o número de empleado ya está registrado por otro usuario'
      });
    }

    const usuario = await pool.query(
      'UPDATE users SET nombre = $1, apellido = $2, correo = $3, numero_empleado = $4, cargo = $5 WHERE id = $6 RETURNING id, nombre, apellido, correo, numero_empleado, cargo, created_at',
      [nombre, apellido, correo, numero_empleado, cargo, id]
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

module.exports = router;
