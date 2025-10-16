import React, { useState, useEffect } from 'react';
import { supabase, Patient, Allergy, MedicalHistory, MedicalVisit, Prescription, LabResult } from '../lib/supabase';
import { User, Heart, FileText, Stethoscope, Pill, FlaskConical, Plus, Calendar, MapPin, Phone, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type PatientDetailViewProps = {
  patient: Patient;
};

export const PatientDetailView: React.FC<PatientDetailViewProps> = ({ patient }) => {
  const { profile } = useAuth();
  const [allergies, setAllergies] = useState<Allergy[]>([]);
  const [medicalHistory, setMedicalHistory] = useState<MedicalHistory[]>([]);
  const [visits, setVisits] = useState<MedicalVisit[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [labResults, setLabResults] = useState<LabResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewVisitForm, setShowNewVisitForm] = useState(false);
  const [newVisit, setNewVisit] = useState({
    reason: '',
    symptoms: '',
    diagnosis: '',
    treatment: '',
    attending_physician: profile?.full_name || '',
  });

  useEffect(() => {
    loadPatientData();
  }, [patient.id]);

  const loadPatientData = async () => {
    setLoading(true);
    try {
      const [allergiesRes, historyRes, visitsRes, prescriptionsRes, labResultsRes] = await Promise.all([
        supabase.from('allergies').select('*').eq('patient_id', patient.id).order('created_at', { ascending: false }),
        supabase.from('medical_history').select('*').eq('patient_id', patient.id).order('created_at', { ascending: false }),
        supabase.from('medical_visits').select('*').eq('patient_id', patient.id).order('visit_date', { ascending: false }),
        supabase.from('prescriptions').select('*').eq('patient_id', patient.id).order('prescribed_date', { ascending: false }),
        supabase.from('lab_results').select('*').eq('patient_id', patient.id).order('test_date', { ascending: false }),
      ]);

      if (allergiesRes.data) setAllergies(allergiesRes.data);
      if (historyRes.data) setMedicalHistory(historyRes.data);
      if (visitsRes.data) setVisits(visitsRes.data);
      if (prescriptionsRes.data) setPrescriptions(prescriptionsRes.data);
      if (labResultsRes.data) setLabResults(labResultsRes.data);
    } catch (error) {
      console.error('Error loading patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewVisitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.hospital_id) return;

    try {
      const { error } = await supabase.from('medical_visits').insert({
        patient_id: patient.id,
        hospital_id: profile.hospital_id,
        reason: newVisit.reason,
        symptoms: newVisit.symptoms,
        diagnosis: newVisit.diagnosis || null,
        treatment: newVisit.treatment || null,
        attending_physician: newVisit.attending_physician,
        created_by: profile.id,
      });

      if (error) throw error;

      setNewVisit({
        reason: '',
        symptoms: '',
        diagnosis: '',
        treatment: '',
        attending_physician: profile.full_name,
      });
      setShowNewVisitForm(false);
      await loadPatientData();
    } catch (error) {
      console.error('Error creating visit:', error);
      alert('Error al registrar la visita');
    }
  };

  const calculateAge = (dob: string) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-start gap-6">
          <div className="bg-blue-100 p-4 rounded-full">
            <User className="w-12 h-12 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {patient.first_name} {patient.last_name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <FileText className="w-4 h-4" />
                <span>
                  <strong>{patient.identification_type}:</strong> {patient.identification_number}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-4 h-4" />
                <span>{calculateAge(patient.date_of_birth)} años</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Heart className="w-4 h-4" />
                <span>{patient.blood_type || 'No especificado'}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="w-4 h-4" />
                <span>{patient.city}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="w-4 h-4" />
                <span>{patient.phone}</span>
              </div>
              {patient.email && (
                <div className="flex items-center gap-2 text-gray-700">
                  <Mail className="w-4 h-4" />
                  <span>{patient.email}</span>
                </div>
              )}
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong className="text-gray-900">EPS:</strong>
                  <span className="text-gray-700 ml-2">{patient.eps}</span>
                </div>
                <div>
                  <strong className="text-gray-900">Contacto de Emergencia:</strong>
                  <span className="text-gray-700 ml-2">
                    {patient.emergency_contact_name} ({patient.emergency_contact_phone})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {allergies.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <h3 className="text-lg font-semibold text-red-900">Alergias</h3>
          </div>
          <div className="space-y-2">
            {allergies.map((allergy) => (
              <div key={allergy.id} className="flex items-center gap-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  allergy.severity === 'severe'
                    ? 'bg-red-600 text-white'
                    : allergy.severity === 'moderate'
                    ? 'bg-orange-500 text-white'
                    : 'bg-yellow-500 text-white'
                }`}>
                  {allergy.severity === 'severe' ? 'Severa' : allergy.severity === 'moderate' ? 'Moderada' : 'Leve'}
                </span>
                <span className="text-red-900 font-medium">{allergy.allergy_name}</span>
                {allergy.notes && <span className="text-red-700 text-sm">- {allergy.notes}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Historial de Visitas</h3>
          </div>
          <button
            onClick={() => setShowNewVisitForm(!showNewVisitForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Visita</span>
          </button>
        </div>

        {showNewVisitForm && (
          <form onSubmit={handleNewVisitSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Motivo de Consulta *
                </label>
                <input
                  type="text"
                  value={newVisit.reason}
                  onChange={(e) => setNewVisit({ ...newVisit, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Médico Tratante *
                </label>
                <input
                  type="text"
                  value={newVisit.attending_physician}
                  onChange={(e) => setNewVisit({ ...newVisit, attending_physician: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Síntomas *
              </label>
              <textarea
                value={newVisit.symptoms}
                onChange={(e) => setNewVisit({ ...newVisit, symptoms: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Diagnóstico
              </label>
              <textarea
                value={newVisit.diagnosis}
                onChange={(e) => setNewVisit({ ...newVisit, diagnosis: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tratamiento
              </label>
              <textarea
                value={newVisit.treatment}
                onChange={(e) => setNewVisit({ ...newVisit, treatment: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Guardar Visita
              </button>
              <button
                type="button"
                onClick={() => setShowNewVisitForm(false)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <p className="text-gray-500 text-center py-4">Cargando...</p>
        ) : visits.length > 0 ? (
          <div className="space-y-4">
            {visits.map((visit) => (
              <div key={visit.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{visit.reason}</h4>
                    <p className="text-sm text-gray-600">
                      {formatDate(visit.visit_date)} - Dr. {visit.attending_physician}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong className="text-gray-700">Síntomas:</strong>
                    <p className="text-gray-600">{visit.symptoms}</p>
                  </div>
                  {visit.diagnosis && (
                    <div>
                      <strong className="text-gray-700">Diagnóstico:</strong>
                      <p className="text-gray-600">{visit.diagnosis}</p>
                    </div>
                  )}
                  {visit.treatment && (
                    <div>
                      <strong className="text-gray-700">Tratamiento:</strong>
                      <p className="text-gray-600">{visit.treatment}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No hay visitas registradas</p>
        )}
      </div>

      {medicalHistory.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Antecedentes Médicos</h3>
          </div>
          <div className="space-y-3">
            {medicalHistory.map((history) => (
              <div key={history.id} className="border-l-4 border-blue-500 pl-4 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-900">{history.condition}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    history.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : history.status === 'chronic'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {history.status === 'active' ? 'Activo' : history.status === 'chronic' ? 'Crónico' : 'Resuelto'}
                  </span>
                </div>
                {history.diagnosed_date && (
                  <p className="text-sm text-gray-600">
                    Diagnosticado: {formatDate(history.diagnosed_date)}
                  </p>
                )}
                {history.notes && <p className="text-sm text-gray-600 mt-1">{history.notes}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {prescriptions.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <Pill className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Medicamentos Recientes</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prescriptions.slice(0, 6).map((prescription) => (
              <div key={prescription.id} className="border rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">{prescription.medication_name}</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Dosis:</strong> {prescription.dosage}</p>
                  <p><strong>Frecuencia:</strong> {prescription.frequency}</p>
                  <p><strong>Duración:</strong> {prescription.duration}</p>
                  {prescription.instructions && (
                    <p><strong>Instrucciones:</strong> {prescription.instructions}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Prescrito: {formatDate(prescription.prescribed_date)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {labResults.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <FlaskConical className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Resultados de Laboratorio</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold text-gray-900">Examen</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-900">Resultado</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-900">Rango Normal</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-900">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {labResults.slice(0, 10).map((result) => (
                  <tr key={result.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">{result.test_name}</td>
                    <td className="px-4 py-3 text-gray-700">{result.result}</td>
                    <td className="px-4 py-3 text-gray-600">{result.normal_range || '-'}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(result.test_date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
