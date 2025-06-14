# Arquitectura de Incredi-List

## 1. Visión General

Incredi-List es una aplicación construida siguiendo los principios de Domain-Driven Design (DDD), CQRS y Event Sourcing. La arquitectura está diseñada para ser mantenible, escalable y fácil de entender.

## 2. Contextos Acotados

### 2.1 UserManagement
El contexto de gestión de usuarios maneja todas las operaciones relacionadas con los usuarios del sistema.

#### Características Principales:
- **UserCreation**: Creación de usuarios con versionado de API (v1/v2)
- **UserEditing**: Edición de usuarios existentes
- **UserListing**: Listado y paginación de usuarios

### 2.2 Messaging
El contexto de mensajería maneja la comunicación con los usuarios a través de diferentes canales.

#### Características:
- **WelcomeMessage**: Mensajes de bienvenida
- **Strategies**: Implementaciones de diferentes canales (SMS, Email, Console)

### 2.3 Shared
Componentes compartidos entre contextos.

## 3. Estructura de Directorios

### 3.1 Estructura General
```
src/
├── Contexts/
│   ├── UserManagement/
│   │   ├── Features/
│   │   │   ├── UserCreation/
│   │   │   │   ├── Domain/
│   │   │   │   │   ├── Aggregates/
│   │   │   │   │   ├── Entities/
│   │   │   │   │   ├── ValueObjects/
│   │   │   │   │   ├── Events/
│   │   │   │   │   ├── Errors/
│   │   │   │   │   └── Repositories/
│   │   │   │   ├── Application/
│   │   │   │   │   ├── Commands/
│   │   │   │   │   ├── CommandHandlers/
│   │   │   │   │   ├── Queries/
│   │   │   │   │   ├── QueryHandlers/
│   │   │   │   │   └── DTOs/
│   │   │   │   ├── Infrastructure/
│   │   │   │   │   ├── Container/
│   │   │   │   │   ├── Factories/
│   │   │   │   │   └── Persistence/
│   │   │   │   └── Interfaces/
│   │   │   │       ├── Controllers/
│   │   │   │       └── Routes/
│   │   │   └── Shared/
│   │   │       ├── Domain/
│   │   │       └── Infrastructure/
│   │   └── Shared/
│   │       ├── Domain/
│   │       └── Infrastructure/
│   └── Shared/
│       ├── Domain/
│       │   └── Events/
│       └── Infrastructure/
│           ├── CommandBus/
│           ├── EventBus/
│           └── Configuration/
```

### 3.2 Descripción de Capas

#### 3.2.1 Domain
- **Aggregates**: Agregados que encapsulan entidades y objetos de valor
- **Entities**: Objetos con identidad y ciclo de vida
- **Value Objects**: Objetos inmutables sin identidad
- **Events**: Eventos de dominio
- **Errors**: Errores específicos del dominio
- **Repositories**: Interfaces de repositorio

#### 3.2.2 Application
- **Commands**: Comandos para modificar el estado
- **CommandHandlers**: Manejadores de comandos
- **Queries**: Consultas para leer el estado
- **QueryHandlers**: Manejadores de consultas
- **DTOs**: Objetos de transferencia de datos

#### 3.2.3 Infrastructure
- **Container**: Contenedores de dependencias
- **Factories**: Fábricas para crear objetos
- **Persistence**: Implementaciones de repositorios
- **Configuration**: Configuración de módulos

#### 3.2.4 Interfaces
- **Controllers**: Controladores HTTP
- **Routes**: Definición de rutas

### 3.3 Convenciones de Nombres

#### 3.3.1 Archivos
- **Agregados**: `[Nombre]Aggregate.ts`
- **Entidades**: `[Nombre].ts`
- **Value Objects**: `[Nombre].ts`
- **Eventos**: `[Nombre]Event.ts`
- **Comandos**: `[Nombre]Command.ts`
- **Queries**: `[Nombre]Query.ts`
- **Handlers**: `[Nombre]Handler.ts`
- **Controllers**: `[Nombre]Controller.ts`
- **Repositories**: `I[Nombre]Repository.ts`

#### 3.3.2 Clases
- **Agregados**: `[Nombre]Aggregate`
- **Entidades**: `[Nombre]`
- **Value Objects**: `[Nombre]`
- **Eventos**: `[Nombre]Event`
- **Comandos**: `[Nombre]Command`
- **Queries**: `[Nombre]Query`
- **Handlers**: `[Nombre]Handler`
- **Controllers**: `[Nombre]Controller`
- **Repositories**: `I[Nombre]Repository`

### 3.4 Tests
```
src/
└── Contexts/
    └── UserManagement/
        └── Features/
            └── UserCreation/
                └── __tests__/
                    ├── [Nombre]Aggregate.test.ts
                    ├── [Nombre]CommandHandler.test.ts
                    ├── [Nombre]Controller.test.ts
                    ├── [Nombre]Repository.test.ts
                    └── [Nombre].integration.test.ts
```

#### 3.4.1 Tests Unitarios
- Los tests deben reflejar la misma estructura que el código fuente
- Usar mocks para dependencias externas
- Seguir el patrón AAA (Arrange, Act, Assert)
- Mantener los tests enfocados y atómicos
- Cubrir casos de éxito y error

#### 3.4.2 Tests de Integración
- Probar flujos completos entre componentes
- Usar implementaciones reales en lugar de mocks cuando sea posible
- Verificar interacciones entre módulos
- Validar el comportamiento del sistema en conjunto
- Asegurar la correcta propagación de eventos
- Verificar la consistencia de los datos

#### 3.4.3 Convenciones de Testing
- Nombres descriptivos que indiquen el comportamiento esperado
- Organización por tipo de test (unit, integration)
- Uso de fixtures y helpers para reducir duplicación
- Documentación clara de los casos de prueba
- Mantenimiento de la cobertura de código

## 4. Patrones de Diseño

### 4.1 Domain-Driven Design (DDD)

#### Agregados
```typescript
export class UserAggregate extends AggregateRoot {
    private readonly _id: UserId;
    private readonly _name: UserName;
    private readonly _communicationType: CommunicationType;
    // ...
}
```

#### Objetos de Valor
```typescript
export class UserName extends ValueObject<string> {
    private constructor(value: string) {
        super(value);
    }
    // ...
}
```

#### Eventos de Dominio
```typescript
export class UserCreatedEvent extends DomainEvent {
    constructor(
        public readonly id: UserId,
        public readonly name: UserName,
        public readonly communicationType: CommunicationType
    ) {
        super('UserCreatedEvent');
    }
}
```

### 4.2 CQRS (Command Query Responsibility Segregation)

#### Commands
```typescript
export class CreateUserV1Command {
    constructor(
        public readonly name: string,
        public readonly communicationType: string
    ) {}
}
```

#### Queries
```typescript
export class ListUsersQuery {
    constructor(
        public readonly page: number = 1,
        public readonly limit: number = 10
    ) {}
}
```

### 4.3 Event Sourcing

- Los eventos se almacenan en el `EventStore`
- El estado se reconstruye aplicando eventos
- Las proyecciones mantienen vistas optimizadas para consultas

## 5. Capas de la Aplicación

### 5.1 Dominio
- Agregados
- Entidades
- Objetos de Valor
- Eventos de Dominio
- Repositorios (Interfaces)

### 5.2 Aplicación
- Commands y CommandHandlers
- Queries y QueryHandlers
- DTOs
- Servicios de Aplicación

### 5.3 Infraestructura
- Implementaciones de Repositorios
- Event Store
- Controllers
- Rutas
- Configuración

### 5.4 Interfaces
- Controllers
- Presentación
- APIs REST

## 6. Flujo de Datos

### 6.1 Creación de Usuario
1. Request HTTP → Controller
2. Controller → Command
3. Command → CommandHandler
4. CommandHandler → Repository
5. Repository → Event Store
6. Event → Event Bus
7. Event → Proyecciones

### 6.2 Consulta de Usuarios
1. Request HTTP → Controller
2. Controller → Query
3. Query → QueryHandler
4. QueryHandler → Read Model
5. Read Model → Response

## 7. Persistencia

### 7.1 Event Store
- Almacena todos los eventos de dominio
- Permite reconstrucción del estado
- Mantiene historial de cambios

### 7.2 Read Models
- Optimizados para consultas
- Actualizados por proyecciones
- Separados de los modelos de escritura

## 8. Comunicación entre Contextos

### 8.1 Event Bus
- Publicación de eventos de dominio
- Suscripción a eventos
- Desacoplamiento entre contextos

### 8.2 Eventos de Integración
- Comunicación entre contextos
- Transformación de eventos de dominio
- Manejo de consistencia eventual

## 9. Seguridad

### 9.1 Validación
- Validación de entrada en capa de aplicación
- Validación de dominio en objetos de valor
- Manejo de errores consistente

### 9.2 Autenticación y Autorización
- Pendiente de implementación
- Planificado para futuras versiones

## 10. Monitoreo y Logging

### 10.1 Logging
- Eventos de dominio
- Errores y excepciones
- Operaciones críticas

### 10.2 Métricas
- Pendiente de implementación
- Planificado para futuras versiones

## 11. Despliegue

### 11.1 Contenedores
- Docker para desarrollo y producción
- Configuración mediante variables de entorno
- CI/CD con GitHub Actions

### 11.2 Escalabilidad
- Arquitectura preparada para escalar horizontalmente
- Event Sourcing para consistencia eventual
- CQRS para optimización de lecturas/escrituras 