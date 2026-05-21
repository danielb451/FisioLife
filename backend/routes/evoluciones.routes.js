const express = require('express');
const pool = require('../config/db');

const router = express.Router();

// LISTAR POR TRATAMIENTO
router.get('/tratamiento/:id', async (req, res) => {

  try {

    const { id } = req.params;

    const [evoluciones] = await pool.execute(`
      SELECT *
      FROM evoluciones
      WHERE tratamiento_id = ?
      ORDER BY numero_sesion ASC
    `, [id]);

    res.json(evoluciones);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: 'Error al listar evoluciones'
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
      observaciones,
      procedimientos,
      dolor,
      movilidad,
      recomendaciones
    } = req.body;

    const [resultado] = await pool.execute(`
      INSERT INTO evoluciones
      (
        tratamiento_id,
        numero_sesion,
        fecha,
        observaciones,
        procedimientos,
        dolor,
        movilidad,
        recomendaciones
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      tratamiento_id,
      numero_sesion,
      fecha,
      observaciones,
      procedimientos,
      dolor,
      movilidad,
      recomendaciones
    ]);

    await pool.execute(`
      UPDATE tratamientos
      SET sesiones_realizadas = sesiones_realizadas + 1
      WHERE id = ?
    `, [tratamiento_id]);

    res.status(201).json({
      mensaje: 'Evolución registrada',
      id: resultado.insertId
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: 'Error al registrar evolución'
    });

  }

});

module.exports = router;