import { useState, useEffect } from 'react';
import { X, UserPlus, Search, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { Patient } from '../types/automaton';

interface NewPatientFormProps {
  onClose: () => void;
  onSubmit: (name: string, idNumber: string, urgency: 'normal' | 'urgent') => void;
}

export default function NewPatientForm({ onClose, onSubmit }: NewPatientFormProps) {
  const [name, setName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [urgency, setUrgency] = useState<'normal' | 'urgent'>('normal');
  const [searchMessage, setSearchMessage] = useState('');
  const [existingPatient, setExistingPatient] = useState<Patient | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (idNumber.trim().length >= 3) {
      const timeout = setTimeout(async () => {
        await searchPatient(idNumber.trim());
      }, 500);
      setSearchTimeout(timeout);
    } else {
      setSearchMessage('');
      setExistingPatient(null);
    }

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [idNumber]);

  const searchPatient = async (id: string) => {
    setIsSearching(true);
    setSearchMessage('');
    setExistingPatient(null);

    try {
      const patient = await api.getPatientByIdNumber(id);
      if (patient) {
        setExistingPatient(patient);
        setName(patient.name);
        setUrgency(patient.urgency);
        setSearchMessage('Paciente encontrado en el sistema');
      } else {
        setSearchMessage('Nuevo paciente - Complete el formulario');
      }
    } catch (error) {
      setSearchMessage('Error al buscar paciente');
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (existingPatient) {
      setSearchMessage('Este paciente ya existe en el sistema');
      return;
    }
    if (name.trim() && idNumber.trim()) {
      onSubmit(name.trim(), idNumber.trim(), urgency);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <UserPlus className="w-6 h-6" />
            Nuevo Paciente
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-blue-700 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Identificación
            </label>
            <div className="relative">
              <input
                type="text"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ej: 1234567890"
                required
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Search className="w-5 h-5 text-gray-400 animate-pulse" />
                </div>
              )}
            </div>
            {searchMessage && (
              <div className={`mt-2 text-sm flex items-center gap-2 ${
                existingPatient
                  ? 'text-green-600'
                  : searchMessage.includes('Error')
                  ? 'text-red-600'
                  : 'text-blue-600'
              }`}>
                <AlertCircle className="w-4 h-4" />
                {searchMessage}
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ej: Juan Pérez"
              required
              disabled={!!existingPatient}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nivel de Urgencia
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUrgency('normal')}
                disabled={!!existingPatient}
                className={`py-3 px-4 rounded-lg border-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  urgency === 'normal'
                    ? 'border-blue-600 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                Normal
              </button>
              <button
                type="button"
                onClick={() => setUrgency('urgent')}
                disabled={!!existingPatient}
                className={`py-3 px-4 rounded-lg border-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  urgency === 'urgent'
                    ? 'border-red-600 bg-red-50 text-red-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                Urgente
              </button>
            </div>
          </div>

          {existingPatient && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800 font-medium">
                Este paciente ya está registrado en el sistema.
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                Estado actual: {existingPatient.currentState}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!!existingPatient}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
            >
              {existingPatient ? 'Ya Registrado' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
