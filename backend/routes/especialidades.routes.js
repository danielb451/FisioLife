const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// LISTAR ESPECIALIDADES
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        id,
        nombre,
        descripcion,
        estado,
        creado_en
      FROM especialidades
      ORDER BY id DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error('Error al listar especialidades:', error);

    res.status(500).json({
      mensaje: 'Error al listar especialidades',
      error: error.message
    });
  }
});

// CREAR ESPECIALIDAD
router.post('/', async (req, res) => {
  try {
    const { nombre, descripcion, estado } = req.body;

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({
        mensaje: 'El nombre de la especialidad es obligatorio'
      });
    }

    await pool.query(
      `
      INSERT INTO especialidades
      (nombre, descripcion, estado)
      VALUES (?, ?, ?)
      `,
      [
        nombre.trim(),
        descripcion || '',
        estado ?? 1
      ]
    );

    res.json({
      mensaje: 'Especialidad registrada correctamente'
    });
  } catch (error) {
    console.error('Error al crear especialidad:', error);

    res.status(500).json({
      mensaje: 'Error al crear especialidad',
      error: error.message
    });
  }
});

// ACTUALIZAR ESPECIALIDAD
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, estado } = req.body;

    if (!nombre || !nombre.trim()) {
      return res.status(400).json({
        mensaje: 'El nombre de la especialidad es obligatorio'
      });
    }

    await pool.query(
      `
      UPDATE especialidades
      SET nombre = ?,
          descripcion = ?,
          estado = ?
      WHERE id = ?
      `,
      [
        nombre.trim(),
        descripcion || '',
        estado ?? 1,
        id
      ]
    );

    res.json({
      mensaje: 'Especialidad actualizada correctamente'
    });
  } catch (error) {
    console.error('Error al actualizar especialidad:', error);

    res.status(500).json({
      mensaje: 'Error al actualizar especialidad',
      error: error.message
    });
  }
});

// ELIMINAR ESPECIALIDAD
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      'DELETE FROM especialidades WHERE id = ?',
      [id]
    );

    res.json({
      mensaje: 'Especialidad eliminada correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar especialidad:', error);

    res.status(500).json({
      mensaje: 'Error al eliminar especialidad',
      error: error.message
    });
  }
});

module.exports = router;