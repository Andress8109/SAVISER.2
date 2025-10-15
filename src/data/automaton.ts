import { StateInfo, Transition, State, Action } from '../types/automaton';

export const states: StateInfo[] = [
  { id: 'q0', name: 'Estado Inicial', description: 'Inicio del proceso', color: 'bg-gray-500' },
  { id: 'q1', name: 'Registro Paciente', description: 'Registro de datos del paciente', color: 'bg-blue-500' },
  { id: 'q2', name: 'Triaje', description: 'Clasificación de urgencia', color: 'bg-yellow-500' },
  { id: 'q3', name: 'Espera Consulta', description: 'En espera de atención', color: 'bg-orange-400' },
  { id: 'q4', name: 'Consulta General', description: 'Atención médica general', color: 'bg-green-500' },
  { id: 'q5', name: 'Evaluación Médica', description: 'Evaluación del médico', color: 'bg-green-600' },
  { id: 'q6', name: 'Solicitud Exámenes', description: 'Orden de exámenes', color: 'bg-purple-500' },
  { id: 'q7', name: 'Espera Resultados', description: 'Esperando resultados', color: 'bg-purple-400' },
  { id: 'q8', name: 'Análisis Resultados', description: 'Revisión de resultados', color: 'bg-purple-600' },
  { id: 'q9', name: 'Derivación Especialista', description: 'Envío a especialista', color: 'bg-pink-500' },
  { id: 'q10', name: 'Consulta Especializada', description: 'Atención especializada', color: 'bg-pink-600' },
  { id: 'q11', name: 'Diagnóstico', description: 'Diagnóstico establecido', color: 'bg-red-500' },
  { id: 'q12', name: 'Prescripción Tratamiento', description: 'Tratamiento prescrito', color: 'bg-teal-500' },
  { id: 'q13', name: 'Administración Medicamentos', description: 'Aplicación de tratamiento', color: 'bg-teal-600' },
  { id: 'q14', name: 'Programación Cirugía', description: 'Cirugía programada', color: 'bg-red-600' },
  { id: 'q15', name: 'Procedimiento Quirúrgico', description: 'Cirugía en curso', color: 'bg-red-700' },
  { id: 'q16', name: 'Recuperación', description: 'Post-operatorio', color: 'bg-cyan-500' },
  { id: 'q17', name: 'Seguimiento', description: 'Monitoreo del paciente', color: 'bg-cyan-600' },
  { id: 'q18', name: 'Alta Médica', description: 'Autorización de salida', color: 'bg-green-700' },
  { id: 'q19', name: 'Facturación', description: 'Proceso de pago', color: 'bg-yellow-600' },
  { id: 'q20', name: 'Proceso Completado', description: 'Atención finalizada', color: 'bg-gray-700' },
];

export const transitions: Transition[] = [
  { from: 'q0', action: 'iniciar', to: 'q1', label: 'Iniciar Proceso' },
  { from: 'q1', action: 'registrar', to: 'q2', label: 'Registrar Paciente' },
  { from: 'q2', action: 'evaluar_urgencia', to: 'q3', label: 'Evaluar Urgencia' },
  { from: 'q2', action: 'urgencia', to: 'q4', label: 'Caso Urgente' },
  { from: 'q3', action: 'asignar_cita', to: 'q4', label: 'Asignar Cita' },
  { from: 'q4', action: 'examinar', to: 'q5', label: 'Examinar' },
  { from: 'q5', action: 'solicitar_examen', to: 'q6', label: 'Solicitar Examen' },
  { from: 'q5', action: 'diagnosticar', to: 'q11', label: 'Diagnosticar Directamente' },
  { from: 'q6', action: 'recibir_resultado', to: 'q7', label: 'Realizar Examen' },
  { from: 'q7', action: 'recibir_resultado', to: 'q8', label: 'Recibir Resultado' },
  { from: 'q8', action: 'derivar', to: 'q9', label: 'Derivar a Especialista' },
  { from: 'q8', action: 'diagnosticar', to: 'q11', label: 'Diagnosticar' },
  { from: 'q9', action: 'asignar_cita', to: 'q10', label: 'Asignar Especialista' },
  { from: 'q10', action: 'examinar', to: 'q11', label: 'Consulta Especializada' },
  { from: 'q11', action: 'prescribir', to: 'q12', label: 'Prescribir Tratamiento' },
  { from: 'q11', action: 'programar_cirugia', to: 'q14', label: 'Programar Cirugía' },
  { from: 'q12', action: 'administrar', to: 'q13', label: 'Administrar Medicamento' },
  { from: 'q13', action: 'monitorear', to: 'q17', label: 'Monitorear' },
  { from: 'q14', action: 'operar', to: 'q15', label: 'Realizar Cirugía' },
  { from: 'q15', action: 'monitorear', to: 'q16', label: 'Post-operatorio' },
  { from: 'q16', action: 'monitorear', to: 'q17', label: 'Seguimiento' },
  { from: 'q17', action: 'monitorear', to: 'q17', label: 'Continuar Seguimiento' },
  { from: 'q17', action: 'dar_alta', to: 'q18', label: 'Dar Alta' },
  { from: 'q18', action: 'facturar', to: 'q19', label: 'Facturar' },
  { from: 'q19', action: 'finalizar', to: 'q20', label: 'Finalizar' },
];

export class AutomataPredictivo {
  private estadoActual: State;
  private historial: Array<{ desde: State; entrada: Action; hacia: State; timestamp: Date }>;

  constructor(estadoInicial: State = 'q0') {
    this.estadoActual = estadoInicial;
    this.historial = [];
  }

  predecirSiguientesEstados(estadoActual: State): Transition[] {
    return transitions.filter(t => t.from === estadoActual);
  }

  procesarEntrada(entrada: Action): boolean {
    const transicion = transitions.find(
      t => t.from === this.estadoActual && t.action === entrada
    );

    if (transicion) {
      this.historial.push({
        desde: this.estadoActual,
        entrada: entrada,
        hacia: transicion.to,
        timestamp: new Date()
      });
      this.estadoActual = transicion.to;
      return true;
    }
    return false;
  }

  getEstadoActual(): State {
    return this.estadoActual;
  }

  getHistorial() {
    return this.historial;
  }
}

export function getStateInfo(stateId: State): StateInfo {
  return states.find(s => s.id === stateId) || states[0];
}

export function getAvailableActions(currentState: State): Transition[] {
  return transitions.filter(t => t.from === currentState);
}
