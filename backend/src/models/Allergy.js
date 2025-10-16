import mongoose from 'mongoose';

const allergySchema = new mongoose.Schema({
  patient_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  allergy_name: {
    type: String,
    required: true
  },
  severity: String,
  notes: String
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Allergy = mongoose.model('Allergy', allergySchema);

export default Allergy;
