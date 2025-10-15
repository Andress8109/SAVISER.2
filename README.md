# SAVISER - Sistema de Atención y Vida al Ser Humano

Sistema completo de gestión hospitalaria con autómata finito determinístico implementando 21 estados del proceso de atención médica.

## 🏗️ Arquitectura

El proyecto está dividido en dos partes:

### Frontend (React + TypeScript + Vite)
- Interfaz de usuario moderna y responsiva
- Dashboard con métricas en tiempo real
- Gestión de pacientes y flujo de estados
- Modo dual: Backend API o LocalStorage

### Backend (Node.js + Express + MongoDB)
- API RESTful completa
- Base de datos MongoDB Atlas
- Validación de transiciones del autómata
- Endpoints para gestión de pacientes

## 📋 Requisitos Previos

- Node.js 18 o superior
- npm o yarn
- Conexión a internet (para MongoDB Atlas)

## 🚀 Instalación y Configuración

### 1. Instalar Frontend

```bash
# En la raíz del proyecto
npm install
```

### 2. Instalar Backend

```bash
cd backend
npm install
```

## ▶️ Ejecutar la Aplicación

### Opción 1: Solo Frontend (modo local)

```bash
npm run dev
```

La aplicación usará LocalStorage para almacenar datos.

### Opción 2: Full Stack (Frontend + Backend)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
Servidor backend en: `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Aplicación frontend en: `http://localhost:5173`

## 🔄 Cambiar entre Modo Local y Backend

En la interfaz, haz clic en el botón "Cambiar" junto al indicador de estado de la base de datos en la esquina superior derecha.

## 🗄️ Base de Datos

La aplicación está configurada para conectarse a MongoDB Atlas:

```
mongodb+srv://andresserayap17:3226325537An@basedto.zz2b4yw.mongodb.net/?retryWrites=true&w=majority&appName=BaseDTO
```

La configuración se encuentra en: `backend/.env`

## 📊 Estados del Autómata (21 Estados)

| Estado | Nombre | Descripción |
|--------|--------|-------------|
| q0 | Estado Inicial | Punto de entrada al sistema |
| q1 | Registro Paciente | Registro de datos del paciente |
| q2 | Triaje | Clasificación de urgencia |
| q3 | Espera Consulta | En espera de atención |
| q4 | Consulta General | Atención médica general |
| q5 | Evaluación Médica | Evaluación del médico |
| q6 | Solicitud Exámenes | Orden de exámenes |
| q7 | Espera Resultados | Esperando resultados |
| q8 | Análisis Resultados | Revisión de resultados |
| q9 | Derivación Especialista | Envío a especialista |
| q10 | Consulta Especializada | Atención especializada |
| q11 | Diagnóstico | Diagnóstico establecido |
| q12 | Prescripción Tratamiento | Tratamiento prescrito |
| q13 | Administración Medicamentos | Aplicación de tratamiento |
| q14 | Programación Cirugía | Cirugía programada |
| q15 | Procedimiento Quirúrgico | Cirugía en curso |
| q16 | Recuperación | Post-operatorio |
| q17 | Seguimiento | Monitoreo del paciente |
| q18 | Alta Médica | Autorización de salida |
| q19 | Facturación | Proceso de pago |
| q20 | Proceso Completado | Atención finalizada |

## 🔌 API Endpoints

### Pacientes

- `GET /api/patients` - Listar todos los pacientes
- `GET /api/patients/:id` - Obtener un paciente específico
- `POST /api/patients` - Crear nuevo paciente
- `PUT /api/patients/:id/transition` - Transición de estado
- `DELETE /api/patients/:id` - Eliminar paciente
- `GET /api/patients/:id/actions` - Acciones disponibles
- `GET /api/patients/stats` - Estadísticas del sistema

### Ejemplo de Creación de Paciente

```bash
curl -X POST http://localhost:3001/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Juan Pérez",
    "idNumber": "1234567890",
    "urgency": "normal"
  }'
```

### Ejemplo de Transición de Estado

```bash
curl -X PUT http://localhost:3001/api/patients/{id}/transition \
  -H "Content-Type: application/json" \
  -d '{
    "action": "iniciar"
  }'
```

## 🎯 Características Principales

- ✅ Implementación completa del autómata finito determinístico (AFD)
- ✅ 21 estados con transiciones validadas
- ✅ Dashboard con métricas en tiempo real
- ✅ Búsqueda y filtrado de pacientes
- ✅ Historial completo de transiciones
- ✅ Clasificación de urgencias
- ✅ Modo dual: Backend API o LocalStorage
- ✅ Interfaz moderna y responsiva
- ✅ Base de datos MongoDB persistente

## 📱 Funcionalidades de la Interfaz

1. **Registro de Pacientes**: Formulario para agregar nuevos pacientes
2. **Dashboard**: Métricas de pacientes totales, activos, completados y urgencias
3. **Tarjetas de Paciente**: Vista resumida con estado actual
4. **Detalles del Paciente**: Modal con información completa y acciones disponibles
5. **Historial**: Registro completo de todas las transiciones
6. **Búsqueda**: Buscar por nombre o número de identificación
7. **Filtros**: Filtrar por estado actual

## 🛠️ Tecnologías Utilizadas

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide React (iconos)

### Backend
- Node.js
- Express
- MongoDB + Mongoose
- CORS
- dotenv

## 📦 Estructura del Proyecto

```
project/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   └── patientController.js
│   │   ├── models/
│   │   │   └── Patient.js
│   │   ├── routes/
│   │   │   └── patientRoutes.js
│   │   └── server.js
│   ├── .env
│   └── package.json
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx
│   │   ├── NewPatientForm.tsx
│   │   ├── PatientCard.tsx
│   │   └── PatientDetails.tsx
│   ├── data/
│   │   └── automaton.ts
│   ├── services/
│   │   └── api.ts
│   ├── types/
│   │   └── automaton.ts
│   ├── App.tsx
│   └── main.tsx
└── package.json
```

## 🔐 Seguridad

- La conexión a MongoDB usa credenciales seguras
- CORS configurado para permitir conexiones desde el frontend
- Validación de transiciones en el backend
- IDs únicos para cada paciente

## 📝 Notas Importantes

- El backend debe estar ejecutándose antes de usar el modo API
- Si el backend no está disponible, la aplicación cambia automáticamente al modo local
- Los datos en modo local se guardan en LocalStorage del navegador
- Los datos en modo API se persisten en MongoDB Atlas

## 🤝 Contribuir

Este proyecto es parte de un trabajo académico para la Universidad de Cartagena.

## 📄 Licencia

Proyecto académico - Universidad de Cartagena
