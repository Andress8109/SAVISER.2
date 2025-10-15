import { Patient, State } from '../types/automaton';
import { states } from '../data/automaton';
import { Users, Activity, CheckCircle, Clock } from 'lucide-react';

interface DashboardProps {
  patients: Patient[];
}

export default function Dashboard({ patients }: DashboardProps) {
  const totalPatients = patients.length;
  const activePatients = patients.filter(p => p.currentState !== 'q20').length;
  const completedPatients = patients.filter(p => p.currentState === 'q20').length;

  const patientsByState: Record<State, number> = states.reduce((acc, state) => {
    acc[state.id] = patients.filter(p => p.currentState === state.id).length;
    return acc;
  }, {} as Record<State, number>);

  const topStates = Object.entries(patientsByState)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Pacientes</p>
              <p className="text-3xl font-bold text-gray-900">{totalPatients}</p>
            </div>
            <Users className="w-12 h-12 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">En Proceso</p>
              <p className="text-3xl font-bold text-orange-600">{activePatients}</p>
            </div>
            <Activity className="w-12 h-12 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completados</p>
              <p className="text-3xl font-bold text-green-600">{completedPatients}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Urgencias</p>
              <p className="text-3xl font-bold text-red-600">
                {patients.filter(p => p.urgency === 'urgent').length}
              </p>
            </div>
            <Clock className="w-12 h-12 text-red-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Estados con Mayor Actividad</h3>
        <div className="space-y-3">
          {topStates.length > 0 ? (
            topStates.map(([stateId, count]) => {
              const stateInfo = states.find(s => s.id === stateId);
              if (!stateInfo) return null;
              const percentage = (count / totalPatients) * 100;

              return (
                <div key={stateId}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{stateInfo.name}</span>
                    <span className="text-sm font-semibold text-gray-900">{count} pacientes</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${stateInfo.color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500 text-sm">No hay pacientes registrados</p>
          )}
        </div>
      </div>
    </div>
  );
}
