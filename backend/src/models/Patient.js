import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema({
  identification_number: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  identification_type: {
    type: String,
    default: 'CC',
    enum: ['CC', 'TI', 'CE', 'PA']
  },
  first_name: {
    type: String,
    required: true,
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true
  },
  date_of_birth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true,
    enum: ['M', 'F', 'O']
  },
  blood_type: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: String,
  eps: {
    type: String,
    required: true
  },
  emergency_contact_name: {
    type: String,
    required: true
  },
  emergency_contact_phone: {
    type: String,
    required: true
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
