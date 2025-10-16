import Patient from '../models/Patient.js';
import MedicalVisit from '../models/MedicalVisit.js';
import Allergy from '../models/Allergy.js';
import MedicalHistory from '../models/MedicalHistory.js';
import Prescription from '../models/Prescription.js';
import LabResult from '../models/LabResult.js';

export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ created_at: -1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPatientByIdNumber = async (req, res) => {
  try {
    const { idNumber } = req.params;
    const patient = await Patient.findOne({ identification_number: idNumber });

    if (!patient) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }

    const allergies = await Allergy.find({ patient_id: patient._id });
    const medical_history = await MedicalHistory.find({ patient_id: patient._id });
    const medical_visits = await MedicalVisit.find({ patient_id: patient._id })
      .sort({ visit_date: -1 });

    const visitsWithDetails = await Promise.all(
      medical_visits.map(async (visit) => {
        const prescriptions = await Prescription.find({ visit_id: visit._id });
        const lab_results = await LabResult.find({ visit_id: visit._id });
        return {
          ...visit.toObject(),
          prescriptions,
          lab_results
        };
      })
    );

    res.json({
      ...patient.toObject(),
      allergies,
      medical_history,
      medical_visits: visitsWithDetails
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPatient = async (req, res) => {
  try {
    const {
      identification_number,
      identification_type,
      first_name,
      last_name,
      date_of_birth,
      gender,
      blood_type,
      address,
      city,
      phone,
      email,
      eps,
      emergency_contact_name,
      emergency_contact_phone
    } = req.body;

    const existingPatient = await Patient.findOne({ identification_number });

    if (existingPatient) {
      return res.status(400).json({ message: 'Ya existe un paciente con este número de identificación' });
    }

    const patient = new Patient({
      identification_number,
      identification_type: identification_type || 'CC',
      first_name,
      last_name,
      date_of_birth,
      gender,
      blood_type: blood_type || null,
      address,
      city,
      phone,
      email: email || null,
      eps,
      emergency_contact_name,
      emergency_contact_phone
    });

    await patient.save();
    res.status(201).json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!patient) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }
    res.json(patient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }

    await Allergy.deleteMany({ patient_id: req.params.id });
    await MedicalHistory.deleteMany({ patient_id: req.params.id });
    await MedicalVisit.deleteMany({ patient_id: req.params.id });
    await Prescription.deleteMany({ patient_id: req.params.id });
    await LabResult.deleteMany({ patient_id: req.params.id });

    res.json({ message: 'Paciente eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createMedicalVisit = async (req, res) => {
  try {
    const {
      patient_id,
      hospital_id,
      reason,
      symptoms,
      diagnosis,
      treatment,
      attending_physician,
      created_by
    } = req.body;

    const visit = new MedicalVisit({
      patient_id,
      hospital_id,
      reason,
      symptoms,
      diagnosis: diagnosis || null,
      treatment: treatment || null,
      attending_physician,
      created_by: created_by || null
    });

    await visit.save();
    res.status(201).json(visit);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPatientVisits = async (req, res) => {
  try {
    const visits = await MedicalVisit.find({ patient_id: req.params.id })
      .sort({ visit_date: -1 });

    const visitsWithDetails = await Promise.all(
      visits.map(async (visit) => {
        const prescriptions = await Prescription.find({ visit_id: visit._id });
        const lab_results = await LabResult.find({ visit_id: visit._id });
        return {
          ...visit.toObject(),
          prescriptions,
          lab_results
        };
      })
    );

    res.json(visitsWithDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAllergy = async (req, res) => {
  try {
    const { patient_id, allergy_name, severity, notes } = req.body;

    const allergy = new Allergy({
      patient_id,
      allergy_name,
      severity: severity || null,
      notes: notes || null
    });

    await allergy.save();
    res.status(201).json(allergy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPatientAllergies = async (req, res) => {
  try {
    const allergies = await Allergy.find({ patient_id: req.params.id })
      .sort({ created_at: -1 });
    res.json(allergies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createMedicalHistory = async (req, res) => {
  try {
    const { patient_id, condition, diagnosed_date, status, notes } = req.body;

    const history = new MedicalHistory({
      patient_id,
      condition,
      diagnosed_date: diagnosed_date || null,
      status: status || 'active',
      notes: notes || null
    });

    await history.save();
    res.status(201).json(history);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPatientMedicalHistory = async (req, res) => {
  try {
    const history = await MedicalHistory.find({ patient_id: req.params.id })
      .sort({ created_at: -1 });
    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createPrescription = async (req, res) => {
  try {
    const {
      visit_id,
      patient_id,
      medication_name,
      dosage,
      frequency,
      duration,
      instructions
    } = req.body;

    const prescription = new Prescription({
      visit_id,
      patient_id,
      medication_name,
      dosage,
      frequency,
      duration,
      instructions: instructions || null
    });

    await prescription.save();
    res.status(201).json(prescription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createLabResult = async (req, res) => {
  try {
    const {
      visit_id,
      patient_id,
      test_name,
      test_date,
      result,
      normal_range,
      notes
    } = req.body;

    const labResult = new LabResult({
      visit_id,
      patient_id,
      test_name,
      test_date,
      result,
      normal_range: normal_range || null,
      notes: notes || null
    });

    await labResult.save();
    res.status(201).json(labResult);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPatientStats = async (req, res) => {
  try {
    const totalPatients = await Patient.countDocuments();
    const totalVisits = await MedicalVisit.countDocuments();

    res.json({
      totalPatients,
      totalVisits
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
