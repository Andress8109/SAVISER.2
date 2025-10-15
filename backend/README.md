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
- `POST /api/patients` - Crear nuevo paciente
  ```json
  {
    "name": "Juan Pérez",
    "idNumber": "1234567890",
    "urgency": "normal"
  }
  ```
- `PUT /api/patients/:id/transition` - Actualizar estado del paciente
  ```json
  {
    "action": "iniciar"
  }
  ```
- `DELETE /api/patients/:id` - Eliminar paciente
- `GET /api/patients/:id/actions` - Obtener acciones disponibles para un paciente
- `GET /api/patients/stats` - Obtener estadísticas generales

## Estructura del Proyecto

```
backend/
├── src/
│   ├── config/
│   │   └── database.js       # Configuración MongoDB
│   ├── models/
│   │   └── Patient.js        # Modelo de datos
│   ├── controllers/
│   │   └── patientController.js  # Lógica de negocio
│   ├── routes/
│   │   └── patientRoutes.js  # Rutas API
│   └── server.js             # Servidor Express
├── .env                      # Variables de entorno
└── package.json
```

## Estados del Autómata

El sistema implementa 21 estados (q0-q20) según el autómata finito determinístico:

- q0: Estado Inicial
- q1: Registro Paciente
- q2: Triaje
- q3: Espera Consulta
- q4: Consulta General
- q5: Evaluación Médica
- q6: Solicitud Exámenes
- q7: Espera Resultados
- q8: Análisis Resultados
- q9: Derivación Especialista
- q10: Consulta Especializada
- q11: Diagnóstico
- q12: Prescripción Tratamiento
- q13: Administración Medicamentos
- q14: Programación Cirugía
- q15: Procedimiento Quirúrgico
- q16: Recuperación
- q17: Seguimiento
- q18: Alta Médica
- q19: Facturación
- q20: Proceso Completado

## Acciones Válidas

Las transiciones entre estados están validadas según el autómata:
- iniciar, registrar, evaluar_urgencia, urgencia, asignar_cita, examinar
- solicitar_examen, recibir_resultado, derivar, diagnosticar, prescribir
- administrar, programar_cirugia, operar, monitorear, dar_alta, facturar, finalizar
