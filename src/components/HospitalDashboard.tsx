import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Search, UserPlus, Building2 } from 'lucide-react';
import { PatientSearch } from './PatientSearch';
import { PatientRegistrationForm } from './PatientRegistrationForm';
import { PatientDetailView } from './PatientDetailView';
import { Patient } from '../lib/supabase';

type View = 'search' | 'register' | 'details';

export const HospitalDashboard: React.FC = () => {
  const { profile, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<View>('search');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const handlePatientFound = (patient: Patient) => {
    setSelectedPatient(patient);
    setCurrentView('details');
  };

  const handlePatientNotFound = () => {
    setCurrentView('register');
  };

  const handlePatientRegistered = (patient: Patient) => {
    setSelectedPatient(patient);
    setCurrentView('details');
  };

  const handleBackToSearch = () => {
    setSelectedPatient(null);
    setCurrentView('search');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">SAVISER</h1>
                <p className="text-sm text-gray-600">{profile?.full_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {currentView !== 'search' && (
                <button
                  onClick={handleBackToSearch}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Volver a Búsqueda
                </button>
              )}
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setCurrentView('search')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              currentView === 'search'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Search className="w-5 h-5" />
            <span>Buscar Paciente</span>
          </button>
          <button
            onClick={() => setCurrentView('register')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              currentView === 'register'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <UserPlus className="w-5 h-5" />
            <span>Nuevo Paciente</span>
          </button>
        </div>

        {currentView === 'search' && (
          <PatientSearch
            onPatientFound={handlePatientFound}
            onPatientNotFound={handlePatientNotFound}
          />
        )}

        {currentView === 'register' && (
          <PatientRegistrationForm onPatientRegistered={handlePatientRegistered} />
        )}

        {currentView === 'details' && selectedPatient && (
          <PatientDetailView patient={selectedPatient} />
        )}
      </main>
    </div>
  );
};
