import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import patientRoutes from './routes/patientRoutes.js';
import { supabase } from './config/supabase.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    message: 'SAVISER API - Sistema de Atención y Vida al Ser Humano',
    version: '2.0.0',
    database: 'Supabase',
    endpoints: {
      patients: '/api/patients',
      stats: '/api/patients/stats',
      patient: '/api/patients/:id',
      patientByIdNumber: '/api/patients/id-number/:idNumber',
      visits: '/api/visits',
      allergies: '/api/allergies',
      medicalHistory: '/api/medical-history',
      prescriptions: '/api/prescriptions',
      labResults: '/api/lab-results'
    }
  });
});

app.get('/health', async (req, res) => {
  try {
    const { data, error } = await supabase.from('patients').select('id').limit(1);
    if (error) throw error;
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'error', database: 'disconnected', error: error.message });
  }
});

app.use('/api', patientRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal!', error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 SAVISER Backend running on port ${PORT}`);
  console.log(`📊 Using Supabase database`);
  console.log(`🌐 API available at http://localhost:${PORT}`);
});
