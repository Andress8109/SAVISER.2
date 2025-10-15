import { useState, useEffect } from 'react';
import { Patient, State, Action, TransitionHistory } from './types/automaton';
import { getAvailableActions, getStateInfo } from './data/automaton';
import PatientCard from './components/PatientCard';
import PatientDetails from './components/PatientDetails';
import NewPatientForm from './components/NewPatientForm';
import Dashboard from './components/Dashboard';
import { Heart, UserPlus, Search, Filter, Database, Wifi, WifiOff } from 'lucide-react';
import { api } from './services/api';

function App() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterState, setFilterState] = useState<State | 'all'>('all');
  const [useBackend, setUseBackend] = useState(true);
  const [backendConnected, setBackendConnected] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (useBackend) {
      loadPatientsFromBackend();
    } else {
      loadPatientsFromLocalStorage();
    }
  }, [useBackend]);

  const loadPatientsFromBackend = async () => {
    setLoading(true);
    try {
      const data = await api.getAllPatients();
      setPatients(data);
      setBackendConnected(true);
    } catch (error) {
      console.error('Error connecting to backend:', error);
      setBackendConnected(false);
      setUseBackend(false);
      loadPatientsFromLocalStorage();
    } finally {
      setLoading(false);
    }
  };

  const loadPatientsFromLocalStorage = () => {
    const savedPatients = localStorage.getItem('saviser_patients');
    if (savedPatients) {
      const parsed = JSON.parse(savedPatients);
      const patientsWithDates = parsed.map((p: Patient) => ({
        ...p,
        createdAt: new Date(p.createdAt),
        history: p.history.map((h: TransitionHistory) => ({
          ...h,
          timestamp: new Date(h.timestamp)
        }))
      }));
      setPatients(patientsWithDates);
    }
  };

  useEffect(() => {
    if (!useBackend && patients.length > 0) {
      localStorage.setItem('saviser_patients', JSON.stringify(patients));
    }
  }, [patients, useBackend]);

  const handleNewPatient = async (name: string, idNumber: string, urgency: 'normal' | 'urgent') => {
    setLoading(true);
    try {
      if (useBackend) {
        const newPatient = await api.createPatient(name, idNumber, urgency);
        await api.updatePatientState(newPatient.id, 'iniciar');
        await loadPatientsFromBackend();
      } else {
        const newPatient: Patient = {
          id: Date.now().toString(),
          name,
          idNumber,
          currentState: 'q0',
          history: [],
          createdAt: new Date(),
          urgency
        };
        setPatients([newPatient, ...patients]);
        setTimeout(() => {
          handleAction(newPatient.id, 'iniciar');
        }, 100);
      }
      setShowNewPatientForm(false);
    } catch (error: any) {
      alert(error.message || 'Error al crear paciente');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (patientId: string, action: string) => {
    setLoading(true);
    try {
      if (useBackend) {
        const updatedPatient = await api.updatePatientState(patientId, action as Action);
        setPatients(prevPatients =>
          prevPatients.map(p => p.id === patientId ? updatedPatient : p)
        );
        if (selectedPatient?.id === patientId) {
          setSelectedPatient(updatedPatient);
        }
      } else {
        setPatients(prevPatients => {
          return prevPatients.map(patient => {
            if (patient.id !== patientId) return patient;

            const availableActions = getAvailableActions(patient.currentState);
            const transition = availableActions.find(a => a.action === action);

            if (!transition) return patient;

            const newHistory: TransitionHistory = {
              from: patient.currentState,
              action: action as Action,
              to: transition.to,
              timestamp: new Date()
            };

            const updatedPatient = {
              ...patient,
              currentState: transition.to,
              history: [...patient.history, newHistory]
            };

            if (selectedPatient?.id === patientId) {
              setSelectedPatient(updatedPatient);
            }

            return updatedPatient;
          });
        });
      }
    } catch (error: any) {
      alert(error.message || 'Error al actualizar estado');
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.idNumber.includes(searchTerm);
    const matchesFilter = filterState === 'all' || patient.currentState === filterState;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <header className="bg-white shadow-md border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-3 rounded-lg">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">SAVISER</h1>
                <p className="text-sm text-gray-600">Sistema de Atención y Vida al Ser Humano</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                {useBackend ? (
                  backendConnected ? (
                    <>
                      <Database className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-green-600 font-medium">MongoDB Conectado</span>
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-600 font-medium">Sin Conexión</span>
                    </>
                  )
                ) : (
                  <>
                    <Database className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600 font-medium">Modo Local</span>
                  </>
                )}
                <button
                  onClick={() => setUseBackend(!useBackend)}
                  className="ml-2 text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Cambiar
                </button>
              </div>
              <button
                onClick={() => setShowNewPatientForm(true)}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-md disabled:opacity-50"
              >
                <UserPlus className="w-5 h-5" />
                Nuevo Paciente
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Dashboard patients={patients} />

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar paciente por nombre o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="sm:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={filterState}
                  onChange={(e) => setFilterState(e.target.value as State | 'all')}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">Todos los Estados</option>
                  <option value="q1">Registro</option>
                  <option value="q2">Triaje</option>
                  <option value="q4">Consulta</option>
                  <option value="q11">Diagnóstico</option>
                  <option value="q17">Seguimiento</option>
                  <option value="q20">Completado</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPatients.length > 0 ? (
            filteredPatients.map(patient => (
              <PatientCard
                key={patient.id}
                patient={patient}
                onClick={() => setSelectedPatient(patient)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">No se encontraron pacientes</p>
              <button
                onClick={() => setShowNewPatientForm(true)}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Registrar primer paciente
              </button>
            </div>
          )}
        </div>
      </main>

      {selectedPatient && (
        <PatientDetails
          patient={selectedPatient}
          onClose={() => setSelectedPatient(null)}
          onAction={handleAction}
        />
      )}

      {showNewPatientForm && (
        <NewPatientForm
          onClose={() => setShowNewPatientForm(false)}
          onSubmit={handleNewPatient}
        />
      )}
    </div>
  );
}

export default App;
