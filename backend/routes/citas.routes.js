const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// LISTAR CITAS
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.id,
        c.paciente_id,
        p.nombre AS paciente_nombre,
        p.apellido AS paciente_apellido,
        p.ci AS paciente_ci,
        p.telefono AS paciente_telefono,
        c.fecha,
        c.hora,
        c.motivo,
        c.estado,
        c.observaciones,
        c.creado_en
      FROM citas c
      INNER JOIN pacientes p ON c.paciente_id = p.id
      WHERE c.activo = 1
      ORDER BY c.fecha DESC, c.hora DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error('Error al listar citas:', error);
    res.status(500).json({
      mensaje: 'Error al listar citas',
      error: error.message
    });
  }
});

// CREAR CITA
router.post('/', async (req, res) => {
  try {
    const {
      paciente_id,
      fecha,
      hora,
      motivo,
      estado,
      observaciones
    } = req.body;

    if (!paciente_id || !fecha || !hora || !motivo) {
      return res.status(400).json({
        mensaje: 'Paciente, fecha, hora y motivo son obligatorios'
      });
    }

    await pool.query(
      `
      INSERT INTO citas 
      (paciente_id, fecha, hora, motivo, estado, observaciones, activo)
      VALUES (?, ?, ?, ?, ?, ?, 1)
      `,
      [
        paciente_id,
        fecha,
        hora,
        motivo,
        estado || 'Pendiente',
        observaciones || ''
      ]
    );

    res.json({
      mensaje: 'Cita registrada correctamente'
    });
  } catch (error) {
    console.error('Error al crear cita:', error);
    res.status(500).json({
      mensaje: 'Error al crear cita',
      error: error.message
    });
  }
});

// ACTUALIZAR CITA
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const {
      paciente_id,
      fecha,
      hora,
      motivo,
      estado,
      observaciones
    } = req.body;

    if (!paciente_id || !fecha || !hora || !motivo) {
      return res.status(400).json({
        mensaje: 'Paciente, fecha, hora y motivo son obligatorios'
      });
    }

    await pool.query(
      `
      UPDATE citas
      SET paciente_id = ?,
          fecha = ?,
          hora = ?,
          motivo = ?,
          estado = ?,
          observaciones = ?
      WHERE id = ?
      `,
      [
        paciente_id,
        fecha,
        hora,
        motivo,
        estado || 'Pendiente',
        observaciones || '',
        id
      ]
    );

    res.json({
      mensaje: 'Cita actualizada correctamente'
    });
  } catch (error) {
    console.error('Error al actualizar cita:', error);
    res.status(500).json({
      mensaje: 'Error al actualizar cita',
      error: error.message
    });
  }
});

// ELIMINAR CITA LÓGICAMENTE
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      'UPDATE citas SET activo = 0 WHERE id = ?',
      [id]
    );

    res.json({
      mensaje: 'Cita eliminada correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar cita:', error);
    res.status(500).json({
      mensaje: 'Error al eliminar cita',
      error: error.message
    });
  }
});

module.exports = router;