import { Patient, Action } from '../types/automaton';

const API_URL = 'http://localhost:3001/api';

export const api = {
  async getAllPatients(): Promise<Patient[]> {
    const response = await fetch(`${API_URL}/patients`);
    if (!response.ok) throw new Error('Error al obtener pacientes');
    const data = await response.json();
    return data.map((p: any) => ({
      ...p,
      id: p._id,
      createdAt: new Date(p.createdAt),
      history: p.history.map((h: any) => ({
        ...h,
        timestamp: new Date(h.timestamp)
      }))
    }));
  },

  async getPatientById(id: string): Promise<Patient> {
    const response = await fetch(`${API_URL}/patients/${id}`);
    if (!response.ok) throw new Error('Error al obtener paciente');
    const data = await response.json();
    return {
      ...data,
      id: data._id,
      createdAt: new Date(data.createdAt),
      history: data.history.map((h: any) => ({
        ...h,
        timestamp: new Date(h.timestamp)
      }))
    };
  },

  async getPatientByIdNumber(idNumber: string): Promise<Patient | null> {
    const response = await fetch(`${API_URL}/patients/id-number/${idNumber}`);
    if (response.status === 404) return null;
    if (!response.ok) throw new Error('Error al buscar paciente');
    const data = await response.json();
    return {
      ...data,
      id: data._id,
      createdAt: new Date(data.createdAt),
      history: data.history.map((h: any) => ({
        ...h,
        timestamp: new Date(h.timestamp)
      }))
    };
  },

  async createPatient(name: string, idNumber: string, urgency: 'normal' | 'urgent'): Promise<Patient> {
    const response = await fetch(`${API_URL}/patients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, idNumber, urgency }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear paciente');
    }
    const data = await response.json();
    return {
      ...data,
      id: data._id,
      createdAt: new Date(data.createdAt),
      history: data.history.map((h: any) => ({
        ...h,
        timestamp: new Date(h.timestamp)
      }))
    };
  },

  async updatePatientState(id: string, action: Action): Promise<Patient> {
    const response = await fetch(`${API_URL}/patients/${id}/transition`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar estado');
    }
    const data = await response.json();
    return {
      ...data,
      id: data._id,
      createdAt: new Date(data.createdAt),
      history: data.history.map((h: any) => ({
        ...h,
        timestamp: new Date(h.timestamp)
      }))
    };
  },

  async deletePatient(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/patients/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar paciente');
  },

  async getAvailableActions(id: string): Promise<Array<{ action: string; to: string }>> {
    const response = await fetch(`${API_URL}/patients/${id}/actions`);
    if (!response.ok) throw new Error('Error al obtener acciones disponibles');
    return response.json();
  },

  async getStats(): Promise<any> {
    const response = await fetch(`${API_URL}/patients/stats`);
    if (!response.ok) throw new Error('Error al obtener estadísticas');
    return response.json();
  }
};
