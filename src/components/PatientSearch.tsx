import React, { useState } from 'react';
import { supabase, Patient } from '../lib/supabase';
import { Search, AlertCircle, UserX } from 'lucide-react';

type PatientSearchProps = {
  onPatientFound: (patient: Patient) => void;
  onPatientNotFound: () => void;
};

export const PatientSearch: React.FC<PatientSearchProps> = ({
  onPatientFound,
  onPatientNotFound,
}) => {
  const [identificationNumber, setIdentificationNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setNotFound(false);
    setLoading(true);

    try {
      const { data, error: searchError } = await supabase
        .from('patients')
        .select('*')
        .eq('identification_number', identificationNumber.trim())
        .maybeSingle();

      if (searchError) throw searchError;

      if (data) {
        onPatientFound(data);
      } else {
        setNotFound(true);
      }
    } catch (err) {
      setError('Error al buscar el paciente. Por favor intente nuevamente.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-md p-8">
        <div className="text-center mb-8">
          <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Search className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Buscar Paciente</h2>
          <p className="text-gray-600">Ingrese el número de identificación del paciente</p>
        </div>

        <form onSubmit={handleSearch} className="space-y-6">
          <div>
            <label htmlFor="identification" className="block text-sm font-medium text-gray-700 mb-2">
              Número de Identificación
            </label>
            <div className="relative">
              <input
                id="identification"
                type="text"
                value={identificationNumber}
                onChange={(e) => setIdentificationNumber(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Ej: 1234567890"
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {notFound && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start gap-3 mb-4">
                <UserX className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-900 mb-1">
                    Paciente no encontrado
                  </p>
                  <p className="text-sm text-yellow-800">
                    No existe un paciente registrado con esta identificación.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onPatientNotFound}
                className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Registrar Nuevo Paciente
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !identificationNumber.trim()}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Buscando...' : 'Buscar Paciente'}
          </button>
        </form>
      </div>
    </div>
  );
};
