const express = require('express');
const pool = require('../config/db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const [especialidades] = await pool.execute(
      'SELECT * FROM especialidades WHERE activo = 1 ORDER BY id DESC'
    );

    res.json(especialidades);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al listar especialidades' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;

    if (!nombre) {
      return res.status(400).json({ mensaje: 'El nombre es obligatorio' });
    }

    const [resultado] = await pool.execute(
      'INSERT INTO especialidades (nombre, descripcion) VALUES (?, ?)',
      [nombre, descripcion || null]
    );

    res.status(201).json({
      mensaje: 'Especialidad registrada correctamente',
      id: resultado.insertId
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar especialidad' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    await pool.execute(
      'UPDATE especialidades SET nombre = ?, descripcion = ? WHERE id = ?',
      [nombre, descripcion || null, id]
    );

    res.json({ mensaje: 'Especialidad actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar especialidad' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.execute(
      'UPDATE especialidades SET activo = 0 WHERE id = ?',
      [id]
    );

    res.json({ mensaje: 'Especialidad eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar especialidad' });
  }
});

module.exports = router;