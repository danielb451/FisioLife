const express = require('express');
const pool = require('../config/db');

const router = express.Router();

// LISTAR
router.get('/', async (req, res) => {
  try {

    const [tratamientos] = await pool.execute(`
      SELECT
        t.*,

        p.nombre AS paciente_nombre,
        p.apellido AS paciente_apellido,

        f.nombre AS fisio_nombre,
        f.apellido AS fisio_apellido

      FROM tratamientos t

      INNER JOIN pacientes p
        ON t.paciente_id = p.id

      INNER JOIN fisioterapeutas f
        ON t.fisioterapeuta_id = f.id

      WHERE t.activo = 1

      ORDER BY t.id DESC
    `);

    res.json(tratamientos);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: 'Error al listar tratamientos'
    });

  }
});

// CREAR
router.post('/', async (req, res) => {

  try {

    const {
      paciente_id,
      fisioterapeuta_id,
      diagnostico,
      objetivo,
      plan_tratamiento,
      sesiones_totales,
      fecha_inicio,
      fecha_fin,
      estado
    } = req.body;

    if (
      !paciente_id ||
      !fisioterapeuta_id ||
      !diagnostico
    ) {
      return res.status(400).json({
        mensaje: 'Datos obligatorios faltantes'
      });
    }

    const [resultado] = await pool.execute(`
      INSERT INTO tratamientos
      (
        paciente_id,
        fisioterapeuta_id,
        diagnostico,
        objetivo,
        plan_tratamiento,
        sesiones_totales,
        fecha_inicio,
        fecha_fin,
        estado
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      paciente_id,
      fisioterapeuta_id,
      diagnostico,
      objetivo || null,
      plan_tratamiento || null,
      sesiones_totales || 0,
      fecha_inicio || null,
      fecha_fin || null,
      estado || 'Pendiente'
    ]);

    res.status(201).json({
      mensaje: 'Tratamiento registrado',
      id: resultado.insertId
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: 'Error al registrar tratamiento'
    });

  }

});

// ACTUALIZAR
router.put('/:id', async (req, res) => {

  try {

    const { id } = req.params;

    const {
      paciente_id,
      fisioterapeuta_id,
      diagnostico,
      objetivo,
      plan_tratamiento,
      sesiones_totales,
      sesiones_realizadas,
      fecha_inicio,
      fecha_fin,
      estado
    } = req.body;

    await pool.execute(`
      UPDATE tratamientos
      SET
        paciente_id = ?,
        fisioterapeuta_id = ?,
        diagnostico = ?,
        objetivo = ?,
        plan_tratamiento = ?,
        sesiones_totales = ?,
        sesiones_realizadas = ?,
        fecha_inicio = ?,
        fecha_fin = ?,
        estado = ?
      WHERE id = ?
    `, [
      paciente_id,
      fisioterapeuta_id,
      diagnostico,
      objetivo,
      plan_tratamiento,
      sesiones_totales,
      sesiones_realizadas,
      fecha_inicio,
      fecha_fin,
      estado,
      id
    ]);

    res.json({
      mensaje: 'Tratamiento actualizado'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: 'Error al actualizar'
    });

  }

});

// ELIMINAR
router.delete('/:id', async (req, res) => {

  try {

    const { id } = req.params;

    await pool.execute(`
      UPDATE tratamientos
      SET activo = 0
      WHERE id = ?
    `, [id]);

    res.json({
      mensaje: 'Tratamiento eliminado'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      mensaje: 'Error al eliminar'
    });

  }

});

module.exports = router;