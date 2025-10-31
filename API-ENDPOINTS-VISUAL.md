# Guía Visual de Endpoints

## URL Base
```
http://localhost:3000/api
```

---

## Mapa de Endpoints

```
┌─────────────────────────────────────────────────────────────────┐
│                    API DE SUSCRIPCIONES                         │
│                 http://localhost:3000/api                        │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
    ┌──────┐             ┌──────┐            ┌──────────┐
    │ AUTH │             │PLANS │            │   SUBS   │
    └──────┘             └──────┘            └──────────┘
        │                     │                     │
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐     ┌──────────────┐
│   REGISTER   │      │  GET PLANS   │     │  CREATE SUB  │
│     🆕       │      │     📋       │     │     💳       │
│              │      │              │     │              │
│ POST /auth/  │      │ GET /plans   │     │ POST /subs   │
│   register   │      │              │     │              │
│              │      │ 🔓 No Auth   │     │ 🔐 JWT       │
│ 🔓 No Auth   │      └──────────────┘     └──────────────┘
└──────────────┘                                  │
        │                                         │
        ▼                                         ▼
┌──────────────┐                          ┌──────────────┐
│    LOGIN     │                          │   GET SUBS   │
│     🔐       │                          │     👤       │
│              │                          │              │
│ POST /auth/  │                          │ GET /subs/   │
│    login     │                          │    :userId   │
│              │                          │              │
│ 🔓 No Auth   │                          │ 🔐 JWT       │
│              │                          │              │
│ ⚡ Returns   │                          └──────────────┘
│   JWT Token  │
└──────────────┘
```

---

## Endpoints Públicos

### 1. Registrar Usuario
```
┌────────────────────────────────────────────────┐
│ POST /api/auth/register                        │
├────────────────────────────────────────────────┤
│ Body:                                          │
│ {                                              │
│   "email": "tu@email.com",                    │
│   "password": "TuPassword123!"                │
│ }                                              │
├────────────────────────────────────────────────┤
│ Respuesta: 201 Created                         │
│ {                                              │
│   "message": "User registered successfully",   │
│   "user": {                                    │
│     "id": 1,                                   │
│     "email": "tu@email.com",                  │
│     "createdAt": "2025-10-31T..."             │
│   }                                            │
│ }                                              │
└────────────────────────────────────────────────┘
```

### 2. Login
```
┌────────────────────────────────────────────────┐
│ POST /api/auth/login                           │
├────────────────────────────────────────────────┤
│ Body:                                          │
│ {                                              │
│   "email": "tu@email.com",                    │
│   "password": "TuPassword123!"                │
│ }                                              │
├────────────────────────────────────────────────┤
│ Respuesta: 200 OK                              │
│ {                                              │
│   "accessToken": "eyJhbG...",    ◄─── GUARDA  │
│   "user": {                                    │
│     "id": 1,                                   │
│     "email": "tu@email.com"                   │
│   }                                            │
│ }                                              │
└────────────────────────────────────────────────┘
```

### 3. Listar Planes
```
┌────────────────────────────────────────────────┐
│ GET /api/plans                                 │
├────────────────────────────────────────────────┤
│ Sin body                                       │
├────────────────────────────────────────────────┤
│ Respuesta: 200 OK                              │
│ {                                              │
│   "count": 4,                                  │
│   "plans": [                                   │
│     {                                          │
│       "id": 1,                                 │
│       "name": "Basic Plan",                    │
│       "price": 9.99,                          │
│       "durationInDays": 30                    │
│     },                                         │
│     { ... más planes ... }                     │
│   ]                                            │
│ }                                              │
└────────────────────────────────────────────────┘
```

---

## 🔐 Endpoints Protegidos (Con JWT)

### 4. Crear Suscripción
```
┌────────────────────────────────────────────────┐
│ POST /api/subscriptions                        │
├────────────────────────────────────────────────┤
│ Headers:                                       │
│ Authorization: Bearer eyJhbG...                │
│                       ▲                        │
│                       └─ Tu token del login    │
├────────────────────────────────────────────────┤
│ Body:                                          │
│ {                                              │
│   "planId": 1    ◄─ 1, 2, 3 o 4               │
│ }                                              │
├────────────────────────────────────────────────┤
│ Respuesta: 201 Created                         │
│ {                                              │
│   "message": "Subscription created",           │
│   "subscription": {                            │
│     "id": 1,                                   │
│     "userId": 1,                               │
│     "planId": 1,                               │
│     "status": "active",                        │
│     "startDate": "2025-10-31T10:00:00Z",      │
│     "endDate": "2025-11-30T10:00:00Z"         │
│   }                                            │
│ }                                              │
└────────────────────────────────────────────────┘
```

### 5. Ver Suscripciones
```
┌────────────────────────────────────────────────┐
│ GET /api/subscriptions/:userId                 │
│                        ▲                       │
│                        └─ ID del usuario       │
├────────────────────────────────────────────────┤
│ Headers:                                       │
│ Authorization: Bearer eyJhbG...                │
├────────────────────────────────────────────────┤
│ Sin body                                       │
├────────────────────────────────────────────────┤
│ Respuesta: 200 OK                              │
│ {                                              │
│   "userId": 1,                                 │
│   "subscriptions": [                           │
│     {                                          │
│       "id": 1,                                 │
│       "status": "active",                      │
│       "planId": 1,                             │
│       "startDate": "2025-10-31...",           │
│       "endDate": "2025-11-30..."              │
│     }                                          │
│   ]                                            │
│ }                                              │
└────────────────────────────────────────────────┘
```

---

## 🎯 Flujo de Usuario Típico

```
    Usuario
      │
      │ 1. Quiero registrarme
      ▼
┌──────────┐
│ REGISTER │  POST /auth/register
└──────────┘  { email, password }
      │
      │ ✅ Cuenta creada
      ▼
┌──────────┐
│  LOGIN   │  POST /auth/login
└──────────┘  { email, password }
      │
      │ ✅ Token recibido
      │    (guardar para próximas requests)
      ▼
┌──────────┐
│  PLANES  │  GET /plans
└──────────┘  Ver opciones
      │
      │ ✅ Elijo Plan Pro (id: 2)
      ▼
┌──────────┐
│ SUSCRIB  │  POST /subscriptions
└──────────┘  { planId: 2 }
      │        + JWT Token
      │
      │ ✅ Suscripción creada
      ▼
┌──────────┐
│ VER SUBS │  GET /subscriptions/1
└──────────┘  + JWT Token
      │
      │ ✅ Veo mi suscripción activa
      ▼
    😊 Listo!
```

---

## 📋 Planes Disponibles (Seed Data)

```
┌─────────────────────────────────────────────────┐
│ ID │ Nombre          │ Precio  │ Duración      │
├────┼─────────────────┼─────────┼───────────────┤
│ 1  │ Basic Plan      │ $9.99   │ 30 días       │
│ 2  │ Pro Plan        │ $29.99  │ 30 días       │
│ 3  │ Enterprise Plan │ $99.99  │ 30 días       │
│ 4  │ Annual Basic    │ $99.99  │ 365 días      │
└─────────────────────────────────────────────────┘
```

---

## 🔑 Estados de Suscripción

```
┌────────────┐
│   ACTIVE   │  ✅ Activa y dentro del periodo
└────────────┘

┌────────────┐
│  EXPIRED   │  ⚠️  Pasó la fecha de fin
└────────────┘

┌────────────┐
│ CANCELLED  │  ❌ Cancelada por el usuario
└────────────┘
```

---

## 🧪 Testing con Postman

### Configurar Authorization

```
┌─────────────────────────────────────────┐
│         Postman Request                 │
├─────────────────────────────────────────┤
│ [GET] [POST] [PUT] [DELETE]            │
│                                         │
│ http://localhost:3000/api/subscriptions│
│                                         │
│ ┌─────────────────────────────────────┐│
│ │ Headers | Body | Auth | ...        ││
│ └─────────────────────────────────────┘│
│                                         │
│ Headers:                                │
│ ┌─────────────────────────────────────┐│
│ │ KEY             │ VALUE             ││
│ ├─────────────────┼───────────────────┤│
│ │ Content-Type    │ application/json  ││
│ │ Authorization   │ Bearer eyJhbG...  ││
│ │                 │        ▲          ││
│ │                 │        │          ││
│ │                 │   Pega tu token   ││
│ └─────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

### O usa Authorization Tab:

```
┌─────────────────────────────────────────┐
│ Auth Type: [ Bearer Token ▼ ]          │
│                                         │
│ Token: [eyJhbGciOiJIUzI1NiI...]        │
│         ▲                               │
│         │                               │
│    Pega tu token aquí                   │
│    (sin "Bearer")                       │
└─────────────────────────────────────────┘
```

---

## ⚡ Atajos de Testing

### Más Rápido: Swagger UI
```
http://localhost:3000/api/docs

1. Click "Try it out"
2. Llena los campos
3. Click "Execute"
4. Ve la respuesta
```

### Automático: PowerShell Script
```powershell
.\test-api.ps1

Prueba todo en 5 segundos!
```

### Completo: Postman Collection
```
1. Import → Postman-Collection.json
2. Run "Complete Flow Test"
3. ✅ Todo probado
```

---

## ❌ Códigos de Error

```
┌─────┬─────────────────────────────────────┐
│ 200 │ ✅ OK - Exitoso                     │
│ 201 │ ✅ Created - Recurso creado         │
│ 400 │ ❌ Bad Request - Validación falló   │
│ 401 │ ❌ Unauthorized - Token inválido    │
│ 404 │ ❌ Not Found - No encontrado        │
│ 409 │ ❌ Conflict - Ya existe             │
│ 500 │ ❌ Server Error - Error del servidor│
└─────┴─────────────────────────────────────┘
```

---

## 🎉 Verificación Final

✅ **La API funciona si puedes hacer esto:**

```
1. POST /auth/register  →  201 Created
2. POST /auth/login     →  200 OK + token
3. GET  /plans          →  200 OK + 4 planes
4. POST /subscriptions  →  201 Created (con token)
5. GET  /subscriptions  →  200 OK + tus suscripciones
```

---


