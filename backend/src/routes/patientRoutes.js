import express from 'express';
import {
  getAllPatients,
  getPatientById,
  getPatientByIdNumber,
  createPatient,
  updatePatient,
  deletePatient,
  createMedicalVisit,
  getPatientVisits,
  createAllergy,
  getPatientAllergies,
  createMedicalHistory,
  getPatientMedicalHistory,
  createPrescription,
  createLabResult,
  getPatientStats
} from '../controllers/patientController.js';

const router = express.Router();

router.get('/patients', getAllPatients);
router.get('/patients/stats', getPatientStats);
router.get('/patients/id-number/:idNumber', getPatientByIdNumber);
router.get('/patients/:id', getPatientById);
router.post('/patients', createPatient);
router.put('/patients/:id', updatePatient);
router.delete('/patients/:id', deletePatient);

router.get('/patients/:id/visits', getPatientVisits);
router.post('/visits', createMedicalVisit);

router.get('/patients/:id/allergies', getPatientAllergies);
router.post('/allergies', createAllergy);

router.get('/patients/:id/medical-history', getPatientMedicalHistory);
router.post('/medical-history', createMedicalHistory);

router.post('/prescriptions', createPrescription);
router.post('/lab-results', createLabResult);

export default router;
