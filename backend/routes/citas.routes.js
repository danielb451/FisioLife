const express = require('express');
const pool = require('../config/db');

const router = express.Router();

// LISTAR CITAS
router.get('/', async (req, res) => {
  try {
    const [citas] = await pool.execute(
      `SELECT 
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
      ORDER BY c.fecha DESC, c.hora DESC`
    );

    res.json(citas);
  } catch (error) {
    console.error('Error al listar citas:', error);
    res.status(500).json({
      mensaje: 'Error al listar citas'
    });
  }
});

// OBTENER CITA POR ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [citas] = await pool.execute(
      `SELECT 
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
      WHERE c.id = ? AND c.activo = 1`,
      [id]
    );

    if (citas.length === 0) {
      return res.status(404).json({
        mensaje: 'Cita no encontrada'
      });
    }

    res.json(citas[0]);
  } catch (error) {
    console.error('Error al obtener cita:', error);
    res.status(500).json({
      mensaje: 'Error al obtener cita'
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

    const [pacienteExiste] = await pool.execute(
      `SELECT id FROM pacientes WHERE id = ? AND estado = 1`,
      [paciente_id]
    );

    if (pacienteExiste.length === 0) {
      return res.status(404).json({
        mensaje: 'El paciente seleccionado no existe'
      });
    }

    const [citaExistente] = await pool.execute(
      `SELECT id FROM citas 
       WHERE fecha = ? 
       AND hora = ? 
       AND activo = 1 
       AND estado IN ('Pendiente', 'Confirmada')`,
      [fecha, hora]
    );

    if (citaExistente.length > 0) {
      return res.status(409).json({
        mensaje: 'Ya existe una cita registrada en esa fecha y hora'
      });
    }

    const [resultado] = await pool.execute(
      `INSERT INTO citas
      (
        paciente_id,
        fecha,
        hora,
        motivo,
        estado,
        observaciones
      )
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        paciente_id,
        fecha,
        hora,
        motivo,
        estado || 'Pendiente',
        observaciones || null
      ]
    );

    res.status(201).json({
      mensaje: 'Cita registrada correctamente',
      id: resultado.insertId
    });
  } catch (error) {
    console.error('Error al registrar cita:', error);
    res.status(500).json({
      mensaje: 'Error al registrar cita'
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

    const [pacienteExiste] = await pool.execute(
      `SELECT id FROM pacientes WHERE id = ? AND estado = 1`,
      [paciente_id]
    );

    if (pacienteExiste.length === 0) {
      return res.status(404).json({
        mensaje: 'El paciente seleccionado no existe'
      });
    }

    const [citaExistente] = await pool.execute(
      `SELECT id FROM citas 
       WHERE fecha = ? 
       AND hora = ? 
       AND id <> ?
       AND activo = 1
       AND estado IN ('Pendiente', 'Confirmada')`,
      [fecha, hora, id]
    );

    if (citaExistente.length > 0) {
      return res.status(409).json({
        mensaje: 'Ya existe otra cita registrada en esa fecha y hora'
      });
    }

    const [resultado] = await pool.execute(
      `UPDATE citas SET
        paciente_id = ?,
        fecha = ?,
        hora = ?,
        motivo = ?,
        estado = ?,
        observaciones = ?
      WHERE id = ? AND activo = 1`,
      [
        paciente_id,
        fecha,
        hora,
        motivo,
        estado || 'Pendiente',
        observaciones || null,
        id
      ]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: 'Cita no encontrada'
      });
    }

    res.json({
      mensaje: 'Cita actualizada correctamente'
    });
  } catch (error) {
    console.error('Error al actualizar cita:', error);
    res.status(500).json({
      mensaje: 'Error al actualizar cita'
    });
  }
});

// ELIMINAR CITA, ELIMINACIÓN LÓGICA
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [resultado] = await pool.execute(
      `UPDATE citas SET activo = 0 WHERE id = ?`,
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: 'Cita no encontrada'
      });
    }

    res.json({
      mensaje: 'Cita eliminada correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar cita:', error);
    res.status(500).json({
      mensaje: 'Error al eliminar cita'
    });
  }
});

module.exports = router;