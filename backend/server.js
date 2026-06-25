const express = require('express');
const cors = require('cors');
require('dotenv').config();

const pool = require('./config/db');

const authRoutes = require('./routes/auth.routes');
const pacientesRoutes = require('./routes/pacientes.routes');
const citasRoutes = require('./routes/citas.routes');
const fisioterapeutasRoutes = require('./routes/fisioterapeutas.routes');
const tratamientosRoutes = require('./routes/tratamientos.routes');
const evolucionesRoutes = require('./routes/evoluciones.routes');
const especialidadesRoutes = require('./routes/especialidades.routes');
const iaRoutes = require('./routes/ia.routes');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    mensaje: 'API FisioLife funcionando correctamente',
    rutas: {
      login: '/api/auth/login',
      perfil: '/api/auth/perfil',
      dashboard: '/api/dashboard'
    }
  });
});

// Prueba de conexión a MySQL
app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 AS conectado');
    res.json({
      ok: true,
      mensaje: 'Conexión a MySQL correcta',
      data: rows[0]
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      mensaje: 'Error conectando a MySQL',
      error: error.message
    });
  }
});

// Dashboard
app.get('/api/dashboard', async (req, res) => {
  try {
    const [[pacientes]] = await pool.query(`
      SELECT COUNT(*) AS total 
      FROM pacientes 
      WHERE estado = 1
    `);

    const [[citasHoy]] = await pool.query(`
      SELECT COUNT(*) AS total 
      FROM citas 
      WHERE fecha = CURDATE()
      AND activo = 1
    `);

    const [[tratamientos]] = await pool.query(`
      SELECT COUNT(*) AS total 
      FROM tratamientos
    `);

    const [[usuarios]] = await pool.query(`
      SELECT COUNT(*) AS total 
      FROM usuarios 
      WHERE estado = 1
    `);

    res.json({
      pacientes: pacientes.total || 0,
      citasHoy: citasHoy.total || 0,
      tratamientos: tratamientos.total || 0,
      usuarios: usuarios.total || 0
    });
  } catch (error) {
    console.error('Error dashboard:', error);

    res.status(500).json({
      mensaje: 'Error al cargar datos del dashboard',
      error: error.message
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/citas', citasRoutes);
app.use('/api/fisioterapeutas', fisioterapeutasRoutes);
app.use('/api/tratamientos', tratamientosRoutes);
app.use('/api/evoluciones', evolucionesRoutes);
app.use('/api/especialidades', especialidadesRoutes);
app.use('/api/ia', iaRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});