const express = require('express');
const pool = require('../config/db');

const router = express.Router();

// LISTAR FISIOTERAPEUTAS
router.get('/', async (req, res) => {
  try {
    const [fisioterapeutas] = await pool.execute(
      `SELECT 
        id,
        nombre,
        apellido,
        ci,
        telefono,
        email,
        direccion,
        especialidad,
        horario_atencion,
        fecha_contratacion,
        estado_laboral,
        creado_en
      FROM fisioterapeutas
      WHERE activo = 1
      ORDER BY id DESC`
    );

    res.json(fisioterapeutas);
  } catch (error) {
    console.error('Error al listar fisioterapeutas:', error);
    res.status(500).json({
      mensaje: 'Error al listar fisioterapeutas'
    });
  }
});

// OBTENER FISIOTERAPEUTA POR ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [fisioterapeutas] = await pool.execute(
      `SELECT 
        id,
        nombre,
        apellido,
        ci,
        telefono,
        email,
        direccion,
        especialidad,
        horario_atencion,
        fecha_contratacion,
        estado_laboral,
        creado_en
      FROM fisioterapeutas
      WHERE id = ? AND activo = 1`,
      [id]
    );

    if (fisioterapeutas.length === 0) {
      return res.status(404).json({
        mensaje: 'Fisioterapeuta no encontrado'
      });
    }

    res.json(fisioterapeutas[0]);
  } catch (error) {
    console.error('Error al obtener fisioterapeuta:', error);
    res.status(500).json({
      mensaje: 'Error al obtener fisioterapeuta'
    });
  }
});

// CREAR FISIOTERAPEUTA
router.post('/', async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      ci,
      telefono,
      email,
      direccion,
      especialidad,
      horario_atencion,
      fecha_contratacion,
      estado_laboral
    } = req.body;

    if (!nombre || !apellido || !especialidad) {
      return res.status(400).json({
        mensaje: 'Nombre, apellido y especialidad son obligatorios'
      });
    }

    const [resultado] = await pool.execute(
      `INSERT INTO fisioterapeutas 
      (
        nombre,
        apellido,
        ci,
        telefono,
        email,
        direccion,
        especialidad,
        horario_atencion,
        fecha_contratacion,
        estado_laboral
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombre,
        apellido,
        ci || null,
        telefono || null,
        email || null,
        direccion || null,
        especialidad,
        horario_atencion || null,
        fecha_contratacion || null,
        estado_laboral || 'Activo'
      ]
    );

    res.status(201).json({
      mensaje: 'Fisioterapeuta registrado correctamente',
      id: resultado.insertId
    });
  } catch (error) {
    console.error('Error al registrar fisioterapeuta:', error);
    res.status(500).json({
      mensaje: 'Error al registrar fisioterapeuta'
    });
  }
});

// ACTUALIZAR FISIOTERAPEUTA
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
      especialidad,
      horario_atencion,
      fecha_contratacion,
      estado_laboral
    } = req.body;

    if (!nombre || !apellido || !especialidad) {
      return res.status(400).json({
        mensaje: 'Nombre, apellido y especialidad son obligatorios'
      });
    }

    const [resultado] = await pool.execute(
      `UPDATE fisioterapeutas SET
        nombre = ?,
        apellido = ?,
        ci = ?,
        telefono = ?,
        email = ?,
        direccion = ?,
        especialidad = ?,
        horario_atencion = ?,
        fecha_contratacion = ?,
        estado_laboral = ?
      WHERE id = ? AND activo = 1`,
      [
        nombre,
        apellido,
        ci || null,
        telefono || null,
        email || null,
        direccion || null,
        especialidad,
        horario_atencion || null,
        fecha_contratacion || null,
        estado_laboral || 'Activo',
        id
      ]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: 'Fisioterapeuta no encontrado'
      });
    }

    res.json({
      mensaje: 'Fisioterapeuta actualizado correctamente'
    });
  } catch (error) {
    console.error('Error al actualizar fisioterapeuta:', error);
    res.status(500).json({
      mensaje: 'Error al actualizar fisioterapeuta'
    });
  }
});

// ELIMINAR FISIOTERAPEUTA, ELIMINACIÓN LÓGICA
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [resultado] = await pool.execute(
      `UPDATE fisioterapeutas SET activo = 0 WHERE id = ?`,
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        mensaje: 'Fisioterapeuta no encontrado'
      });
    }

    res.json({
      mensaje: 'Fisioterapeuta eliminado correctamente'
    });
  } catch (error) {
    console.error('Error al eliminar fisioterapeuta:', error);
    res.status(500).json({
      mensaje: 'Error al eliminar fisioterapeuta'
    });
  }
});

module.exports = router;