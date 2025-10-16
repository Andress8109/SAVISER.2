# SAVISER Backend API

Backend para el Sistema de Atención y Vida al Ser Humano (SAVISER) con MongoDB.

## Instalación

```bash
cd backend
npm install
```

## Configuración

El archivo `.env` ya está configurado con la conexión a MongoDB Atlas:

```
MONGODB_URI=mongodb+srv://andresserayap17:3226325537An@basedto.zz2b4yw.mongodb.net/?retryWrites=true&w=majority&appName=BaseDTO
PORT=3001
```

## Iniciar el Servidor

```bash
npm start
```

O en modo desarrollo (con auto-reload):

```bash
npm run dev
```

El servidor se ejecutará en `http://localhost:3001`

## Endpoints API

### Pacientes

- `GET /api/patients` - Obtener todos los pacientes
- `GET /api/patients/:id` - Obtener un paciente por ID
- `GET /api/patients/id-number/:idNumber` - Obtener paciente por número de identificación
- `POST /api/patients` - Crear nuevo paciente
  ```json
  {
    "identification_number": "1234567890",
    "identification_type": "CC",
    "first_name": "Juan",
    "last_name": "Pérez",
    "date_of_birth": "1990-01-01",
    "gender": "M",
    "blood_type": "O+",
    "address": "Calle 123",
    "city": "Bogotá",
    "phone": "3001234567",
    "email": "juan@example.com",
    "eps": "SURA",
    "emergency_contact_name": "María Pérez",
    "emergency_contact_phone": "3009876543"
  }
  ```
- `PUT /api/patients/:id` - Actualizar paciente
- `DELETE /api/patients/:id` - Eliminar paciente
- `GET /api/patients/stats` - Obtener estadísticas generales

### Visitas Médicas

- `POST /api/visits` - Crear visita médica
- `GET /api/patients/:id/visits` - Obtener visitas de un paciente

### Alergias

- `POST /api/allergies` - Registrar alergia
- `GET /api/patients/:id/allergies` - Obtener alergias de un paciente

### Historial Médico

- `POST /api/medical-history` - Registrar condición médica
- `GET /api/patients/:id/medical-history` - Obtener historial médico

### Prescripciones

- `POST /api/prescriptions` - Crear prescripción

### Resultados de Laboratorio

- `POST /api/lab-results` - Registrar resultado de laboratorio

## Estructura del Proyecto

```
backend/
├── src/
│   ├── config/
│   │   └── database.js       # Configuración MongoDB
│   ├── models/
│   │   ├── Patient.js        # Modelo de pacientes
│   │   ├── MedicalVisit.js   # Modelo de visitas médicas
│   │   ├── Allergy.js        # Modelo de alergias
│   │   ├── MedicalHistory.js # Modelo de historial médico
│   │   ├── Prescription.js   # Modelo de prescripciones
│   │   └── LabResult.js      # Modelo de resultados de laboratorio
│   ├── controllers/
│   │   └── patientController.js  # Lógica de negocio
│   ├── routes/
│   │   └── patientRoutes.js  # Rutas API
│   └── server.js             # Servidor Express
├── .env                      # Variables de entorno
└── package.json
```
