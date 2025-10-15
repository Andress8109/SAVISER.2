import Patient from '../models/Patient.js';

const transitions = [
  { from: 'q0', action: 'iniciar', to: 'q1' },
  { from: 'q1', action: 'registrar', to: 'q2' },
  { from: 'q2', action: 'evaluar_urgencia', to: 'q3' },
  { from: 'q2', action: 'urgencia', to: 'q4' },
  { from: 'q3', action: 'asignar_cita', to: 'q4' },
  { from: 'q4', action: 'examinar', to: 'q5' },
  { from: 'q5', action: 'solicitar_examen', to: 'q6' },
  { from: 'q5', action: 'diagnosticar', to: 'q11' },
  { from: 'q6', action: 'recibir_resultado', to: 'q7' },
  { from: 'q7', action: 'recibir_resultado', to: 'q8' },
  { from: 'q8', action: 'derivar', to: 'q9' },
  { from: 'q8', action: 'diagnosticar', to: 'q11' },
  { from: 'q9', action: 'asignar_cita', to: 'q10' },
  { from: 'q10', action: 'examinar', to: 'q11' },
  { from: 'q11', action: 'prescribir', to: 'q12' },
  { from: 'q11', action: 'programar_cirugia', to: 'q14' },
  { from: 'q12', action: 'administrar', to: 'q13' },
  { from: 'q13', action: 'monitorear', to: 'q17' },
  { from: 'q14', action: 'operar', to: 'q15' },
  { from: 'q15', action: 'monitorear', to: 'q16' },
  { from: 'q16', action: 'monitorear', to: 'q17' },
  { from: 'q17', action: 'monitorear', to: 'q17' },
  { from: 'q17', action: 'dar_alta', to: 'q18' },
  { from: 'q18', action: 'facturar', to: 'q19' },
  { from: 'q19', action: 'finalizar', to: 'q20' }
];

export const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
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

export const createPatient = async (req, res) => {
  try {
    const { name, idNumber, urgency } = req.body;

    const existingPatient = await Patient.findOne({ idNumber });
    if (existingPatient) {
      return res.status(400).json({ message: 'Ya existe un paciente con este número de identificación' });
    }

    const patient = new Patient({
      name,
      idNumber,
      urgency: urgency || 'normal',
      currentState: 'q0',
      history: []
    });

    const newPatient = await patient.save();
    res.status(201).json(newPatient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePatientState = async (req, res) => {
  try {
    const { action } = req.body;
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }

    const validTransition = transitions.find(
      t => t.from === patient.currentState && t.action === action
    );

    if (!validTransition) {
      return res.status(400).json({
        message: 'Transición no válida',
        currentState: patient.currentState,
        attemptedAction: action
      });
    }

    patient.history.push({
      from: patient.currentState,
      action: action,
      to: validTransition.to,
      timestamp: new Date()
    });

    patient.currentState = validTransition.to;
    patient.updatedAt = new Date();

    const updatedPatient = await patient.save();
    res.json(updatedPatient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }

    await patient.deleteOne();
    res.json({ message: 'Paciente eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAvailableActions = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (!patient) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }

    const availableActions = transitions
      .filter(t => t.from === patient.currentState)
      .map(t => ({
        action: t.action,
        to: t.to
      }));

    res.json(availableActions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPatientStats = async (req, res) => {
  try {
    const total = await Patient.countDocuments();
    const active = await Patient.countDocuments({ currentState: { $ne: 'q20' } });
    const completed = await Patient.countDocuments({ currentState: 'q20' });
    const urgent = await Patient.countDocuments({ urgency: 'urgent' });

    const stateDistribution = await Patient.aggregate([
      {
        $group: {
          _id: '$currentState',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({
      total,
      active,
      completed,
      urgent,
      stateDistribution
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
