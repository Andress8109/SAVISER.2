import { supabase } from '../config/supabase.js';

export const getAllPatients = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPatientById = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', req.params.id)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPatientByIdNumber = async (req, res) => {
  try {
    const { idNumber } = req.params;
    const { data, error } = await supabase
      .from('patients')
      .select(`
        *,
        allergies (*),
        medical_history (*),
        medical_visits (
          *,
          prescriptions (*),
          lab_results (*)
        )
      `)
      .eq('identification_number', idNumber)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }

    res.json(data);
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

    const { data: existingPatient } = await supabase
      .from('patients')
      .select('id')
      .eq('identification_number', identification_number)
      .maybeSingle();

    if (existingPatient) {
      return res.status(400).json({ message: 'Ya existe un paciente con este número de identificación' });
    }

    const { data, error } = await supabase
      .from('patients')
      .insert({
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
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePatient = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('patients')
      .update({
        ...req.body,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ message: 'Paciente no encontrado' });
    }
    res.json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePatient = async (req, res) => {
  try {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
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

    const { data, error } = await supabase
      .from('medical_visits')
      .insert({
        patient_id,
        hospital_id,
        reason,
        symptoms,
        diagnosis: diagnosis || null,
        treatment: treatment || null,
        attending_physician,
        created_by: created_by || null
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPatientVisits = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('medical_visits')
      .select(`
        *,
        prescriptions (*),
        lab_results (*)
      `)
      .eq('patient_id', req.params.id)
      .order('visit_date', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAllergy = async (req, res) => {
  try {
    const { patient_id, allergy_name, severity, notes } = req.body;

    const { data, error } = await supabase
      .from('allergies')
      .insert({
        patient_id,
        allergy_name,
        severity: severity || null,
        notes: notes || null
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPatientAllergies = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('allergies')
      .select('*')
      .eq('patient_id', req.params.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createMedicalHistory = async (req, res) => {
  try {
    const { patient_id, condition, diagnosed_date, status, notes } = req.body;

    const { data, error } = await supabase
      .from('medical_history')
      .insert({
        patient_id,
        condition,
        diagnosed_date: diagnosed_date || null,
        status: status || 'active',
        notes: notes || null
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPatientMedicalHistory = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('medical_history')
      .select('*')
      .eq('patient_id', req.params.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(data || []);
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

    const { data, error } = await supabase
      .from('prescriptions')
      .insert({
        visit_id,
        patient_id,
        medication_name,
        dosage,
        frequency,
        duration,
        instructions: instructions || null
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
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

    const { data, error } = await supabase
      .from('lab_results')
      .insert({
        visit_id,
        patient_id,
        test_name,
        test_date,
        result,
        normal_range: normal_range || null,
        notes: notes || null
      })
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getPatientStats = async (req, res) => {
  try {
    const { data: totalData, error: totalError } = await supabase
      .from('patients')
      .select('id', { count: 'exact', head: true });

    const { data: visitsData, error: visitsError } = await supabase
      .from('medical_visits')
      .select('id', { count: 'exact', head: true });

    if (totalError) throw totalError;
    if (visitsError) throw visitsError;

    res.json({
      totalPatients: totalData?.length || 0,
      totalVisits: visitsData?.length || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
