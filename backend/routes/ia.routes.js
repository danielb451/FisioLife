const express = require('express');
const axios = require('axios');
const multer = require('multer');
const fs = require('fs');

const pool = require('../config/db');

const router = express.Router();

const upload = multer({
  dest: 'uploads/ia/',
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434/api/generate';
const OLLAMA_MODEL_TEXT = process.env.OLLAMA_MODEL_TEXT || 'llama3.2';
const OLLAMA_MODEL_VISION = process.env.OLLAMA_MODEL_VISION || 'llama3.2-vision';

router.post('/consulta', upload.single('imagen'), async (req, res) => {
  try {
    const { paciente_id, consulta } = req.body;

    const consultaTexto = (consulta || '').toLowerCase();

    const palabrasPermitidas = [
      'fisioterapia',
      'fisioterapeutica',
      'fisioterapéutica',
      'rehabilitacion',
      'rehabilitación',
      'dolor',
      'lesion',
      'lesión',
      'musculo',
      'músculo',
      'muscular',
      'articulacion',
      'articulación',
      'columna',
      'lumbar',
      'cervical',
      'dorsal',
      'rodilla',
      'hombro',
      'codo',
      'muñeca',
      'tobillo',
      'cadera',
      'pierna',
      'brazo',
      'espalda',
      'postura',
      'movilidad',
      'flexibilidad',
      'fuerza',
      'ejercicio',
      'estiramiento',
      'masaje',
      'terapia',
      'tratamiento',
      'diagnostico',
      'diagnóstico',
      'evaluacion',
      'evaluación',
      'evolucion',
      'evolución',
      'paciente',
      'contractura',
      'fractura',
      'esguince',
      'tendinitis',
      'hernia',
      'ciatica',
      'ciática',
      'recuperacion',
      'recuperación'
    ];

    const esConsultaFisioterapia = palabrasPermitidas.some((palabra) =>
      consultaTexto.includes(palabra)
    );

    if (consulta && !esConsultaFisioterapia && !req.file) {
      return res.status(400).json({
        mensaje: 'El asistente IA solo responde consultas relacionadas con fisioterapia, rehabilitación, lesiones, dolor, movilidad o tratamiento clínico.'
      });
    }

    if (!paciente_id) {
      return res.status(400).json({
        mensaje: 'Debes seleccionar un paciente'
      });
    }

    if (!consulta && !req.file) {
      return res.status(400).json({
        mensaje: 'Debes escribir una consulta o subir una imagen'
      });
    }

    const [pacientes] = await pool.execute(
      `SELECT 
        id,
        nombre,
        apellido,
        ci,
        telefono,
        fecha_nacimiento,
        genero,
        motivo_consulta
      FROM pacientes
      WHERE id = ? AND estado = 1`,
      [paciente_id]
    );

    if (pacientes.length === 0) {
      return res.status(404).json({
        mensaje: 'Paciente no encontrado'
      });
    }

    const paciente = pacientes[0];

    const prompt = `
Eres un asistente de apoyo clínico EXCLUSIVAMENTE para fisioterapia y rehabilitación.

REGLAS OBLIGATORIAS:
- Solo puedes responder consultas relacionadas con fisioterapia, rehabilitación, dolor musculoesquelético, postura, movilidad, ejercicios terapéuticos, tratamientos y evolución clínica.
- Si la consulta no está relacionada con fisioterapia, responde únicamente:
"Lo siento, solo puedo ayudar con consultas relacionadas con fisioterapia y rehabilitación."
- No respondas temas de política, programación, cocina, deportes generales, economía, entretenimiento ni tareas escolares.
- No reemplazas el criterio profesional del fisioterapeuta.
- No debes dar un diagnóstico médico definitivo.

Datos del paciente:
- Nombre: ${paciente.nombre} ${paciente.apellido}
- CI: ${paciente.ci || 'No registrado'}
- Teléfono: ${paciente.telefono || 'No registrado'}
- Fecha de nacimiento: ${paciente.fecha_nacimiento || 'No registrada'}
- Género: ${paciente.genero || 'No registrado'}
- Motivo de consulta registrado: ${paciente.motivo_consulta || 'No registrado'}

Consulta del fisioterapeuta:
${consulta || 'El fisioterapeuta adjuntó una imagen para análisis.'}

Responde en español con esta estructura:

1. Observaciones iniciales
2. Posibles causas o hipótesis fisioterapéuticas
3. Evaluaciones físicas recomendadas
4. Recomendaciones de intervención fisioterapéutica
5. Señales de alerta para derivación médica
6. Nota de seguridad indicando que es apoyo y no diagnóstico definitivo
`;

    let imagenBase64 = null;

    if (req.file) {
      const imagenBuffer = fs.readFileSync(req.file.path);
      imagenBase64 = imagenBuffer.toString('base64');
      fs.unlinkSync(req.file.path);
    }

    const payload = {
      model: imagenBase64 ? OLLAMA_MODEL_VISION : OLLAMA_MODEL_TEXT,
      prompt,
      stream: false
    };

    if (imagenBase64) {
      payload.images = [imagenBase64];
    }

    const respuestaOllama = await axios.post(OLLAMA_URL, payload, {
      timeout: 120000
    });

    res.json({
      mensaje: 'Consulta procesada correctamente',
      paciente,
      respuesta: respuestaOllama.data.response
    });

  } catch (error) {
    console.error('Error IA:', error.response?.data || error.message);

    res.status(500).json({
      mensaje: 'Error al consultar con Ollama. Verifica que Ollama esté abierto y el modelo instalado.'
    });
  }
});

module.exports = router;
