import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import patientRoutes from './routes/patientRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    message: 'SAVISER API - Sistema de Atención y Vida al Ser Humano',
    version: '1.0.0',
    endpoints: {
      patients: '/api/patients',
      stats: '/api/patients/stats',
      patient: '/api/patients/:id',
      actions: '/api/patients/:id/actions',
      transition: '/api/patients/:id/transition'
    }
  });
});

app.use('/api', patientRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal!', error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 SAVISER Backend running on port ${PORT}`);
});
