# Prueba Técnica Backend Mid

## Instrucciones para Levantar el Proyecto 

### Paso 1:

```bash
npm install
```

### Paso 2: Configurar Variables de Entorno

Copia el archivo `.env.example` a `.env`:

```bash
# Windows PowerShell
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales (ver sección de Variables de Entorno más abajo).

### Paso 3: Levantar Base de Datos MySQL

```bash
docker-compose up -d
```
### Paso 4: Ejecutar Migraciones

```bash
# Aplicar migraciones a la base de datos
npm run db:push

# Poblar base de datos con datos de ejemplo
npm run db:seed
```

### Paso 5: Iniciar la Aplicación

```bash
npm run start:dev
```


## 📝 Variables de Entorno (.env.example)

El archivo `.env.example` contiene todas las variables de entorno necesarias documentadas:

```env
# Application
NODE_ENV=development
PORT=3000
API_PREFIX=api

# Database MySQL
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=root
DATABASE_PASSWORD=password
DATABASE_NAME=subscriptions_db

# JWT Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRATION=1d

# Firebase (opcional para logs de auditoría)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_DATABASE_URL=https://your-project.firebaseio.com
```

**Nota**: Copia `.env.example` a `.env` y rellena los valores según tu configuración local.

---

## 🏗️ Arquitectura

Este proyecto implementa **Clean Architecture / Arquitectura Hexagonal** (Ports & Adapters), separando el código en 4 capas principales:

```
src/
├── domain/                    # Capa de Dominio (Entidades y Contratos)
│   ├── entities/             # User, Plan, Subscription
│   ├── repositories/         # Interfaces de repositorios
│   └── services/             # Interfaces de servicios
│
├── application/              # Capa de Aplicación (Casos de Uso)
│   └── use-cases/
│       ├── auth/            # RegisterUser, LoginUser
│       ├── plans/           # GetAllPlans
│       └── subscriptions/   # CreateSubscription, GetUserSubscription
│
├── infrastructure/           # Capa de Infraestructura (Adaptadores)
│   ├── database/
│   │   └── mysql/          # Drizzle ORM, schemas, migraciones
│   ├── repositories/        # Implementaciones de repositorios
│   └── services/            # FirebaseAuditService
│
├── presentation/             # Capa de Presentación (Controllers, DTOs)
│   ├── controllers/         # AuthController, PlansController, SubscriptionsController
│   ├── dtos/               # DTOs con validaciones
│   ├── guards/             # JwtAuthGuard
│   └── decorators/         # CurrentUser
│
└── modules/                 # Módulos de NestJS
    ├── auth/
    ├── plans/
    └── subscriptions/
```

### Principios Aplicados

- **Inversión de Dependencias**: Las capas externas dependen de las internas mediante interfaces
- **Separación de Responsabilidades**: Cada capa tiene una función específica y bien definida
- **Independencia de Frameworks**: La lógica de negocio (Domain y Application) no depende de NestJS
- **Testabilidad**: Fácil de testear con mocks gracias a las interfaces del dominio

### Ventajas de esta Arquitectura

- **Mantenibilidad**: Cambios en una capa no afectan las demás
- **Escalabilidad**: Agregar features sin romper código existente
- **Flexibilidad**: Cambiar de MySQL a PostgreSQL, de REST a GraphQL, solo afecta capas externas


### Configuración

El archivo `drizzle.config.ts` está configurado para:
- Leer schemas desde: `src/infrastructure/database/mysql/schemas/`
- Generar migraciones en: `src/infrastructure/database/mysql/migrations/`
- Conectarse a MySQL según variables de entorno

### Scripts Disponibles

```bash
# Generar nuevas migraciones basadas en cambios de schemas
npm run db:generate

# Aplicar migraciones a la base de datos
npm run db:push

# Poblar base de datos con datos de ejemplo
npm run db:seed

# Abrir Drizzle Studio (GUI para explorar la DB)
npm run db:studio
```

### Estructura de Migraciones

```
src/infrastructure/database/mysql/
├── schemas/                    # Schemas tipo-safe de Drizzle
│   ├── user.schema.ts
│   ├── plan.schema.ts
│   └── subscription.schema.ts
└── migrations/                 # Migraciones SQL generadas
    └── 0000_*.sql
```

### Características de Drizzle

- ✅ **Schemas tipados**: Inferencia automática de tipos TypeScript
- ✅ **Migraciones versionadas**: Control total sobre cambios de schema
- ✅ **Relaciones**: Foreign keys correctamente definidas entre tablas
- ✅ **Type-safety**: Autocompletado y validación en tiempo de compilación

---

## Logs en Firebase

El proyecto implementa logs de auditoría en **Firebase Firestore** para registrar eventos importantes del sistema.

### Eventos Registrados

- `user_registered` - Cuando un usuario se registra
- `user_login` - Intentos de login exitosos
- `subscription_created` - Creación de nuevas suscripciones
- `subscription_cancelled` - Cancelación de suscripciones
- `subscription_expired` - Suscripciones que expiran
- `error_occurred` - Errores críticos del sistema

### Configuración

1. Crea un proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Ve a **Project Settings > Service Accounts**
3. Genera una nueva clave privada (JSON)
4. Copia las credenciales al archivo `.env`:
   - `FIREBASE_PROJECT_ID`
   - `FIREBASE_CLIENT_EMAIL`
   - `FIREBASE_PRIVATE_KEY`
   - `FIREBASE_DATABASE_URL`

### Ver Logs

Los logs se almacenan en la colección `audit_logs` de Firestore con la siguiente estructura:

```json
{
  "eventType": "user_registered",
  "userId": 1,
  "metadata": {
    "email": "user@example.com"
  },
  "timestamp": "2025-10-31T10:30:00Z",
  "createdAt": "2025-10-31T10:30:00Z"
}
```
### Logs de Firebase

Link de lightshot: https://prnt.sc/upfY8A3uav7T


## 🛠️ Tecnologías Utilizadas

| Tecnología | Propósito |
|------------|-----------|
| **NestJS** | Framework backend TypeScript |
| **TypeScript** | Tipado estático |
| **Drizzle ORM** | ORM type-safe con migraciones |
| **MySQL** | Base de datos relacional |
| **Firebase Admin** | Logs y auditorías en Firestore |
| **JWT** | Autenticación stateless |
| **class-validator** | Validación de DTOs |
| **Swagger** | Documentación interactiva de API |
| **Jest** | Testing unitario |
| **Docker** | Containerización |

## 📚 API Endpoints

### Authentication

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Registrar usuario | ❌ |
| POST | `/api/auth/login` | Iniciar sesión | ❌ |

### Plans

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| GET | `/api/plans` | Listar planes | ❌ |
| GET | `/api/plans?activeOnly=true` | Listar planes activos | ❌ |

### Subscriptions

| Método | Endpoint | Descripción | Autenticación |
|--------|----------|-------------|---------------|
| POST | `/api/subscriptions` | Crear suscripción | ✅ Bearer Token |
| GET | `/api/subscriptions/:userId` | Ver suscripciones de usuario | ✅ Bearer Token |

### Ejemplo de uso

#### 1. Registrar usuario

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

#### 2. Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
```

Respuesta:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

#### 3. Crear suscripción

```bash
curl -X POST http://localhost:3000/api/subscriptions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"planId": 1}'
```

#### 4. Ver suscripciones

```bash
curl http://localhost:3000/api/subscriptions/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🧪 Testing

### Tests Unitarios

```bash
npm run test
```

### Tests con Coverage

```bash
npm run test:cov
```

### Tests E2E

```bash
npm run test:e2e
```

### Tests en Watch Mode

```bash
npm run test:watch
```

## 📁 Estructura del Proyecto

```
prueba-tecnica/
├── .github/
│   └── workflows/
│       └── ci-cd.yml           # Pipeline CI/CD
├── src/
│   ├── application/            # Casos de Uso
│   ├── domain/                 # Entidades y Contratos
│   ├── infrastructure/         # Adaptadores (DB, Firebase)
│   │   ├── database/
│   │   │   └── mysql/
│   │   │       ├── schemas/    # Schemas de Drizzle
│   │   │       └── migrations/ # Migraciones SQL
│   │   └── repositories/       # Implementaciones
│   ├── modules/                # Módulos de NestJS
│   ├── presentation/           # Controllers, DTOs, Guards
│   ├── app.module.ts
│   └── main.ts
├── test/                       # Tests E2E
├── .env.example               # Variables de entorno documentadas
├── docker-compose.yml         # MySQL local
├── Dockerfile                 # Imagen Docker
├── drizzle.config.ts         # Configuración de Drizzle ORM
├── package.json
└── README.md
```

## 📝 Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `npm run start:dev` | Inicia en modo desarrollo |
| `npm run build` | Compila el proyecto |
| `npm run test` | Ejecuta tests unitarios |
| `npm run db:generate` | Genera migraciones de Drizzle |
| `npm run db:push` | Aplica migraciones a la DB |
| `npm run db:seed` | Llena la DB con datos de ejemplo |

---

## Autor
Jesús Felipe Mendoza Salcedo
Desarrollado como prueba técnica para Backend Mid.

