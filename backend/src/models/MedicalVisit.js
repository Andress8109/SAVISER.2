import mongoose from 'mongoose';

const medicalVisitSchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  hospital_id: {
    type: String,
    required: true
  },
  visit_date: {
    type: Date,
    default: Date.now
  },
  reason: {
    type: String,
    required: true
  },
  symptoms: String,
  diagnosis: String,
  treatment: String,
  attending_physician: {
    type: String,
    required: true
  },
  created_by: String
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const MedicalVisit = mongoose.model('MedicalVisit', medicalVisitSchema);

export default MedicalVisit;
