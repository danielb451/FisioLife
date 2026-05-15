const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const verificarToken = require('../middleware/auth.middleware');
require('dotenv').config();

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ mensaje: 'Correo y contraseña son obligatorios' });
    }

    const [usuarios] = await pool.execute(
      'SELECT * FROM usuarios WHERE email = ? AND estado = 1 LIMIT 1',
      [email]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    const usuario = usuarios[0];
    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({
      mensaje: 'Inicio de sesion correcto',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: 'Error en el servidor' });
  }
});

router.get('/perfil', verificarToken, async (req, res) => {
  return res.json({ usuario: req.usuario });
});

module.exports = router;
