const express = require('express');
const cors = require('cors');
require('dotenv').config();

const initDb = require('./config/initDb');
const authRoutes = require('./routes/auth.routes');
const pacientesRoutes = require('./routes/pacientes.routes');
const citasRoutes = require('./routes/citas.routes');
const fisioterapeutasRoutes = require('./routes/fisioterapeutas.routes');
const tratamientosRoutes = require('./routes/tratamientos.routes');
const evolucionesRoutes = require('./routes/evoluciones.routes');
const especialidadesRoutes = require('./routes/especialidades.routes');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:4200',
  credentials: true
}));

app.use(express.json());
app.use('/api/pacientes', pacientesRoutes);
app.use('/api/citas', citasRoutes);
app.use('/api/fisioterapeutas', fisioterapeutasRoutes);
app.use('/api/tratamientos', tratamientosRoutes);
app.use('/api/evoluciones', evolucionesRoutes);
app.use('/api/especialidades', especialidadesRoutes);

app.get('/', (req, res) => {
  res.json({
    mensaje: 'API FisioLife funcionando correctamente',
    rutas: {
      login: '/api/auth/login',
      perfil: '/api/auth/perfil'
    }
  });
});

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 3000;

initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al inicializar la base de datos:', error.message);
    process.exit(1);
  });
