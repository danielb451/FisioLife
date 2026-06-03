const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// LISTAR EVOLUCIONES POR TRATAMIENTO
router.get('/:tratamiento_id', async (req, res) => {
  try {
    const { tratamiento_id } = req.params;

    const [rows] = await pool.query(
      `
      SELECT 
        id,
        tratamiento_id,
        numero_sesion,
        fecha,
        procedimientos,
        observaciones,
        dolor,
        movilidad,
        recomendaciones,
        creado_en
      FROM evoluciones
      WHERE tratamiento_id = ?
      AND activo = 1
      ORDER BY numero_sesion ASC, fecha ASC
      `,
      [tratamiento_id]
    );

    res.json(rows);
  } catch (error) {
    console.error('Error al listar evoluciones:', error);

    res.status(500).json({
      mensaje: 'Error al listar evoluciones',
      error: error.message
    });
  }
});

// CREAR EVOLUCIÓN
router.post('/', async (req, res) => {
  try {
    const {
      tratamiento_id,
      numero_sesion,
      fecha,
      procedimientos,
      observaciones,
      dolor,
      movilidad,
      recomendaciones
    } = req.body;

    if (!tratamiento_id || !numero_sesion || !fecha) {
      return res.status(400).json({
        mensaje: 'Tratamiento, número de sesión y fecha son obligatorios'
      });
    }

    await pool.query(
      `
      INSERT INTO evoluciones
      (
        tratamiento_id,
        numero_sesion,
        fecha,
        procedimientos,
        observaciones,
        dolor,
        movilidad,
        recomendaciones,
        activo
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
      `,
      [
        tratamiento_id,
        numero_sesion,
        fecha,
        procedimientos || '',
        observaciones || '',
        dolor || '',
        movilidad || '',
        recomendaciones || ''
      ]
    );

    res.json({
      mensaje: 'Evolución registrada correctamente'
    });
  } catch (error) {
    console.error('Error al crear evolución:', error);

    res.status(500).json({
      mensaje: 'Error al registrar evolución',
      error: error.message
    });
  }
});

// ELIMINAR EVOLUCIÓN LÓGICAMENTE
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      'UPDATE evoluciones SET activo = 0 WHERE id = ?',
      [id]
    );

    res.json({
      mensaje: 'Evolución eliminada correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar evolución:', error);

    res.status(500).json({
      mensaje: 'Error al eliminar evolución',
      error: error.message
    });
  }
});

module.exports = router;