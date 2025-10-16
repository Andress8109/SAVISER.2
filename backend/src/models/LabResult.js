import mongoose from 'mongoose';

const labResultSchema = new mongoose.Schema({
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
  test_name: {
    type: String,
    required: true
  },
  test_date: {
    type: Date,
    required: true
  },
  result: {
    type: String,
    required: true
  },
  normal_range: String,
  notes: String
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const LabResult = mongoose.model('LabResult', labResultSchema);

export default LabResult;
