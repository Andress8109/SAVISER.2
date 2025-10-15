export type State =
  | 'q0' | 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6' | 'q7' | 'q8' | 'q9'
  | 'q10' | 'q11' | 'q12' | 'q13' | 'q14' | 'q15' | 'q16' | 'q17' | 'q18' | 'q19' | 'q20';

export type Action =
  | 'iniciar' | 'registrar' | 'evaluar_urgencia' | 'asignar_cita' | 'examinar'
  | 'solicitar_examen' | 'recibir_resultado' | 'derivar' | 'diagnosticar'
  | 'prescribir' | 'administrar' | 'programar_cirugia' | 'operar'
  | 'monitorear' | 'dar_alta' | 'facturar' | 'finalizar' | 'urgencia';

export interface StateInfo {
  id: State;
  name: string;
  description: string;
  color: string;
}

export interface Transition {
  from: State;
  action: Action;
  to: State;
  label: string;
}

export interface Patient {
  id: string;
  name: string;
  idNumber: string;
  currentState: State;
  history: TransitionHistory[];
  createdAt: Date;
  urgency: 'normal' | 'urgent';
}

export interface TransitionHistory {
  from: State;
  action: Action;
  to: State;
  timestamp: Date;
}
