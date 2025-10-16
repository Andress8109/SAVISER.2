import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  visit_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MedicalVisit',
    required: true
  },
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  medication_name: {
    type: String,
    required: true
  },
  dosage: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  instructions: String
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

export default Prescription;
