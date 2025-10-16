import mongoose from 'mongoose';

const medicalHistorySchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  condition: {
    type: String,
    required: true
  },
  diagnosed_date: Date,
  status: {
    type: String,
    default: 'active',
    enum: ['active', 'resolved', 'chronic']
  },
  notes: String
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const MedicalHistory = mongoose.model('MedicalHistory', medicalHistorySchema);

export default MedicalHistory;
