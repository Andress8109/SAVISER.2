import express from 'express';
import {
  getAllPatients,
  getPatientById,
  getPatientByIdNumber,
  createPatient,
  updatePatientState,
  deletePatient,
  getAvailableActions,
  getPatientStats
} from '../controllers/patientController.js';

const router = express.Router();

router.get('/patients', getAllPatients);
router.get('/patients/stats', getPatientStats);
router.get('/patients/id-number/:idNumber', getPatientByIdNumber);
router.get('/patients/:id', getPatientById);
router.get('/patients/:id/actions', getAvailableActions);
router.post('/patients', createPatient);
router.put('/patients/:id/transition', updatePatientState);
router.delete('/patients/:id', deletePatient);

export default router;
