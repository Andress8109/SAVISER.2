import { Patient } from '../types/automaton';
import { getStateInfo } from '../data/automaton';
import { User, Clock, AlertCircle } from 'lucide-react';

interface PatientCardProps {
  patient: Patient;
  onClick: () => void;
}

export default function PatientCard({ patient, onClick }: PatientCardProps) {
  const stateInfo = getStateInfo(patient.currentState);

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow border-l-4"
      style={{ borderLeftColor: stateInfo.color.replace('bg-', '#') }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-gray-600" />
          <div>
            <h3 className="font-semibold text-gray-900">{patient.name}</h3>
            <p className="text-sm text-gray-500">ID: {patient.idNumber}</p>
          </div>
        </div>
        {patient.urgency === 'urgent' && (
          <div className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium">
            <AlertCircle className="w-3 h-3" />
            Urgente
          </div>
        )}
      </div>

      <div className={`${stateInfo.color} text-white px-3 py-2 rounded-md text-sm font-medium mb-2`}>
        {stateInfo.name}
      </div>

      <p className="text-xs text-gray-600 mb-2">{stateInfo.description}</p>

      <div className="flex items-center gap-1 text-xs text-gray-500">
        <Clock className="w-3 h-3" />
        {new Date(patient.createdAt).toLocaleString('es-ES')}
      </div>
    </div>
  );
}
