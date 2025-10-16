import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserProfile = {
  id: string;
  email: string;
  full_name: string;
  user_type: 'admin' | 'hospital';
  hospital_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Hospital = {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  country: string;
  status: 'active' | 'inactive';
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type Patient = {
  id: string;
  identification_number: string;
  identification_type: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: string;
  blood_type: string | null;
  address: string;
  city: string;
  phone: string;
  email: string | null;
  eps: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  created_at: string;
  updated_at: string;
};

export type Allergy = {
  id: string;
  patient_id: string;
  allergy_name: string;
  severity: 'mild' | 'moderate' | 'severe' | null;
  notes: string | null;
  created_at: string;
};

export type MedicalHistory = {
  id: string;
  patient_id: string;
  condition: string;
  diagnosed_date: string | null;
  status: 'active' | 'resolved' | 'chronic';
  notes: string | null;
  created_at: string;
};

export type MedicalVisit = {
  id: string;
  patient_id: string;
  hospital_id: string;
  visit_date: string;
  reason: string;
  symptoms: string;
  diagnosis: string | null;
  treatment: string | null;
  attending_physician: string;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type Prescription = {
  id: string;
  visit_id: string;
  patient_id: string;
  medication_name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string | null;
  prescribed_date: string;
  created_at: string;
};

export type LabResult = {
  id: string;
  visit_id: string;
  patient_id: string;
  test_name: string;
  test_date: string;
  result: string;
  normal_range: string | null;
  notes: string | null;
  created_at: string;
};
