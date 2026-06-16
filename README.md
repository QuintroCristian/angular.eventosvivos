# Eventos Vivos - Frontend (Angular 22 + Material Design)

Frontend de la aplicación web para gestión de eventos, construido con **Angular 22** y **Angular Material** para una interfaz de usuario profesional y responsiva.

## 📋 Descripción

Este proyecto proporciona una interfaz moderna para visualizar eventos, gestionar reservas y acceder a detalles de eventos. Utiliza arquitectura feature-driven con separación clara de responsabilidades.

## 🏗️ Estructura del Proyecto

```
src/app/
├── core/                      # Servicios singleton, interceptores, guards
│   ├── http/
│   │   ├── api.service.ts         # Servicio de comunicación con API REST
│   │   └── error.interceptor.ts   # Manejo centralizado de errores HTTP
│   └── models/                # Interfaces y DTOs globales
│       ├── enums.ts              # Enumeraciones (TipoEvento, EstadoEvento, etc.)
│       ├── evento.model.ts        # Interfaz EventoResponseDto
│       └── reserva.model.ts       # Interfaz ReservaResponseDto
│
├── modules/                   # Módulos/Componentes agrupados por funcionalidad
│   ├── eventos/
│   │   ├── pages/             # Componentes enrutables
│   │   │   └── evento-list.component.*
│   │   └── components/        # Componentes de presentación
│   │       └── evento-card.component.*
│   │
│   └── reservas/             # [Próximas mejoras]
│       ├── pages/
│       └── components/
│
├── shared/                    # Componentes reutilizables
│   ├── components/           # [Próximas mejoras]
│   ├── directives/           # [Próximas mejoras]
│   └── pipes/                # [Próximas mejoras]
│
├── app.config.ts             # Configuración global (providers)
├── app.routes.ts             # Definición de rutas
└── app.ts                    # Componente raíz
```

## 🚀 Primeros Pasos

### Requisitos Previos

- Node.js v18+ 
- npm v9+
- Angular CLI v22+

### Instalación

```bash
cd agents-frontend-angular-material-setup

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
ng serve

# Navegar a http://localhost:4200/
```

## 🛠️ Comandos Disponibles

```bash
# Desarrollo con hot-reload
ng serve

# Compilar para desarrollo
ng build --configuration dllo

# Ejecutar pruebas unitarias
ng test

# Ejecutar linter
ng lint
```

## 🔌 Integración con API

### Configuración del Endpoint

Edita `src/environments/environment.ts` para desarrollo:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'  // Cambiar según tu backend
};
```

Para desarrollo, se creo `src/environments/environment.dllo.ts`.

### Servicios Disponibles

#### ApiService (`src/app/core/http/api.service.ts`)

```typescript
// Obtener eventos con filtros opcionales
getEventos(filtros?: { tipo?: TipoEvento, estado?: EstadoEvento }): Observable<EventoResponseDto[]>

// Obtener evento por ID
getEventoById(id: number): Observable<EventoResponseDto>

// Crear nuevo evento
crearEvento(evento: EventoResponseDto): Observable<EventoResponseDto>

// Actualizar evento
actualizarEvento(id: number, evento: EventoResponseDto): Observable<EventoResponseDto>

// Eliminar evento
eliminarEvento(id: number): Observable<void>

// Métodos de reservas disponibles (getReservas, getReservaById, crearReserva, cancelarReserva)
```

### Manejo de Errores

El interceptor de errores (`error.interceptor.ts`) captura automáticamente:
- Errores HTTP 4xx y 5xx
- Mensajes de error del formato `{ "Error": "mensaje" }`
- Los muestra mediante notificaciones (SnackBar) de Material

```typescript
return next(req).pipe(
  catchError((error) => {
    let errorMsg = 'Ocurrió un error inesperado';
    if (error.error?.Error) {
      errorMsg = error.error.Error;
    }
    snackBar.open(errorMsg, 'Cerrar', { duration: 5000 });
    return throwError(() => error);
  })
);
```

## 📦 Modelos y Enumeraciones

### Enumeraciones

```typescript
// src/app/core/models/enums.ts

enum TipoEvento {
  Conferencia = 0,
  Taller = 1,
  Concierto = 2
}

enum EstadoEvento {
  Activo = 0,
  Cancelado = 1,
  Completado = 2
}

enum EstadoReserva {
  PendientePago = 0,
  Confirmada = 1,
  Cancelada = 2
}
```

### DTOs

```typescript
// EventoResponseDto
interface EventoResponseDto {
  id: number;
  titulo: string;
  descripcion: string;
  fechaInicio: string;     // ISO 8601 (UTC)
  fechaFin: string;        // ISO 8601 (UTC)
  tipo: TipoEvento;
  estado: EstadoEvento;
  venueNombre: string;
  venueCiudad: string;
  capacidadMaxima: number;
  precio: number;
}

// ReservaResponseDto
interface ReservaResponseDto {
  id: number;
  eventoId: number;
  usuarioId: number;
  estado: EstadoReserva;
  fechaCreacion: string;
  cantidadEntradas: number;
  precioTotal: number;
}
```

## 🎨 Material Design

El proyecto incluye Angular Material con:
- **Tema predefinido**: Azure/Blue
- **Componentes**: Card, Button, Snackbar, Progress Spinner, Chips
- **Animaciones**: Configuradas automáticamente

Para personalizar el tema, edita `src/styles.scss`.

## ⏰ Manejo de Fechas y Zonas Horarias

- **Backend envía**: Fechas en UTC con formato ISO 8601 (ej: `2025-08-10T18:00:00Z`)
- **Frontend muestra**: Convertidas automáticamente a la zona horaria del navegador
- **Al crear eventos**: Usa `toISOString()` para asegurar consistencia con validaciones del servidor

Ejemplo:
```typescript
// El DatePipe maneja la conversión automáticamente
{{ evento.fechaInicio | date: 'medium' }}

// Resultado en cliente (ej, usuario en Medellín):
// "10 ago 2025, 1:00:00 p.m." (UTC-5)
```

## 📝 Próximas Mejoras Planeadas

- [ ] Módulo de Reservas con formulario reactivo
- [ ] Módulo de Autenticación (Login/Logout)
- [ ] Componentes reutilizables en Shared (Spinners, Paginador)
- [ ] Guards de ruta y Roles
- [ ] Temas dinámicos (Light/Dark mode)
- [ ] PWA (Progressive Web App)
- [ ] Lazy loading de módulos

