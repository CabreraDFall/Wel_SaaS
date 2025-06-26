const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const supabase = require('../config/db');

// const pool = require('..'); // Eliminamos la importación de pool

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
    const { data: usuarios, error } = await supabase
      .from('users')
      .select('id, first_name, last_name, email, employee_number, role, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error al obtener usuarios:', error);
      return res.status(500).json({
        mensaje: 'Error al obtener usuarios',
        error: error.message
      });
    }

    res.json(usuarios);
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
    const { data: usuario, error } = await supabase
      .from('users')
      .select('id, first_name, last_name, email, employee_number, role, created_at')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error al obtener usuario por ID:', error);
      return res.status(500).json({
        mensaje: 'Error al obtener el usuario',
        error: error.message
      });
    }

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    res.json(usuario);
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
    const { data: usuarioExiste, error: errorUsuarioExiste } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (errorUsuarioExiste) {
      console.error('Error al verificar si el usuario existe:', errorUsuarioExiste);
      return res.status(500).json({ mensaje: 'Error al verificar el usuario', error: errorUsuarioExiste.message });
    }

    if (!usuarioExiste) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    // Verificar si el correo o número de empleado ya existe en otro usuario
    const { data: duplicado, error: errorDuplicado } = await supabase
      .from('users')
      .select('*')
      .or(`email.eq.${email},employee_number.eq.${employee_number}`)
      .neq('id', id);

    if (errorDuplicado) {
      console.error('Error al verificar duplicados:', errorDuplicado);
      return res.status(500).json({ mensaje: 'Error al verificar duplicados', error: errorDuplicado.message });
    }

    if (duplicado && duplicado.length > 0) {
      return res.status(400).json({
        mensaje: 'El correo o número de empleado ya está registrado por otro usuario'
      });
    }

    const { data: usuario, error } = await supabase
      .from('users')
      .update({ first_name, last_name, email, employee_number, role })
      .eq('id', id)
      .select('id, first_name, last_name, email, employee_number, role, created_at')
      .single();

    if (error) {
      console.error('Error al actualizar usuario:', error);
      return res.status(500).json({
        mensaje: 'Error al actualizar el usuario',
        error: error.message
      });
    }

    res.json(usuario);
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
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error al eliminar usuario:', error);
      return res.status(500).json({
        mensaje: 'Error al eliminar el usuario',
        error: error.message
      });
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
