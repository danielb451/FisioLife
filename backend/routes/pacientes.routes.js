const express = require('express');
const pool = require('../config/db');

const router = express.Router();

/* LISTAR PACIENTES */
router.get('/', async (req, res) => {
  try {
    const [pacientes] = await pool.execute(
      `SELECT * FROM pacientes 
       WHERE estado = 1 
       ORDER BY id DESC`
    );

    res.json(pacientes);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: 'Error al listar pacientes'
    });
  }
});

/* OBTENER PACIENTE POR ID */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [pacientes] = await pool.execute(
      `SELECT * FROM pacientes WHERE id = ? AND estado = 1`,
      [id]
    );

    if (pacientes.length === 0) {
      return res.status(404).json({
        mensaje: 'Paciente no encontrado'
      });
    }

    res.json(pacientes[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: 'Error al obtener paciente'
    });
  }
});

/* CREAR PACIENTE */
router.post('/', async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      ci,
      telefono,
      email,
      direccion,
      fecha_nacimiento,
      genero,
      motivo_consulta
    } = req.body;

    if (!nombre || !apellido) {
      return res.status(400).json({
        mensaje: 'Nombre y apellido son obligatorios'
      });
    }

    const [resultado] = await pool.execute(
      `INSERT INTO pacientes 
      (nombre, apellido, ci, telefono, email, direccion, fecha_nacimiento, genero, motivo_consulta)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        apellido,
        ci || null,
        telefono || null,
        email || null,
        direccion || null,
        fecha_nacimiento || null,
        genero || 'Otro',
        motivo_consulta || null
      ]
    );

    res.status(201).json({
      mensaje: 'Paciente registrado correctamente',
      id: resultado.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: 'Error al registrar paciente'
    });
  }
});

/* ACTUALIZAR PACIENTE */
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const {
      nombre,
      apellido,
      ci,
      telefono,
      email,
      direccion,
      fecha_nacimiento,
      genero,
      motivo_consulta
    } = req.body;

    if (!nombre || !apellido) {
      return res.status(400).json({
        mensaje: 'Nombre y apellido son obligatorios'
      });
    }

    const [resultado] = await pool.execute(
      `UPDATE pacientes SET
        nombre = ?,
        apellido = ?,
        ci = ?,
        telefono = ?,
        email = ?,
        direccion = ?,
        fecha_nacimiento = ?,
        genero = ?,
        motivo_consulta = ?
       WHERE id = ? AND estado = 1`,
      [
        nombre,
        apellido,
        ci || null,
        telefono || null,
        email || null,
        direccion || null,
        fecha_nacimiento || null,
        genero || 'Otro',
        motivo_consulta || null,
        id
      ]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: 'Paciente no encontrado'
      });
    }

    res.json({
      mensaje: 'Paciente actualizado correctamente'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: 'Error al actualizar paciente'
    });
  }
});

/* ELIMINAR PACIENTE */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [resultado] = await pool.execute(
      `UPDATE pacientes SET estado = 0 WHERE id = ?`,
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: 'Paciente no encontrado'
      });
    }

    res.json({
      mensaje: 'Paciente eliminado correctamente'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      mensaje: 'Error al eliminar paciente'
    });
  }
});

module.exports = router;