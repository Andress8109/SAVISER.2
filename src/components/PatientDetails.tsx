import { Patient } from '../types/automaton';
import { getStateInfo, getAvailableActions } from '../data/automaton';
import { X, ArrowRight, Clock, Activity } from 'lucide-react';

interface PatientDetailsProps {
  patient: Patient;
  onClose: () => void;
  onAction: (patientId: string, action: string) => void;
}

export default function PatientDetails({ patient, onClose, onAction }: PatientDetailsProps) {
  const stateInfo = getStateInfo(patient.currentState);
  const availableActions = getAvailableActions(patient.currentState);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Detalles del Paciente</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-700 mb-2">Información Personal</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Nombre</p>
                <p className="font-medium">{patient.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">ID</p>
                <p className="font-medium">{patient.idNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Estado Actual</p>
                <div className={`${stateInfo.color} text-white px-3 py-1 rounded-md text-sm font-medium inline-block mt-1`}>
                  {stateInfo.name}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fecha de Ingreso</p>
                <p className="font-medium">{new Date(patient.createdAt).toLocaleString('es-ES')}</p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Acciones Disponibles
            </h3>
            {availableActions.length > 0 ? (
              <div className="grid gap-2">
                {availableActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => onAction(patient.id, action.action)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-between group"
                  >
                    <span className="font-medium">{action.label}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No hay acciones disponibles en este estado</p>
            )}
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Historial de Estados
            </h3>
            <div className="space-y-3">
              {patient.history.length > 0 ? (
                patient.history.map((entry, index) => {
                  const fromState = getStateInfo(entry.from);
                  const toState = getStateInfo(entry.to);
                  return (
                    <div key={index} className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-500">
                      <div className="flex items-center gap-2 text-sm mb-1">
                        <span className="font-medium">{fromState.name}</span>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">{toState.name}</span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">Acción: {entry.action}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(entry.timestamp).toLocaleString('es-ES')}
                      </p>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-sm">Sin historial disponible</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
