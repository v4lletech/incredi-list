# Guía de Contribución

## Antes de hacer cualquier cambio

Revisa todo el proyecto, lee los archivos, no dupliques codigo o repitas funcionalidad en donde no corresponda, no crees archivos donde no deben de ir, siempre usa esta guia de contribución.

## Estructura del Proyecto

```
src/
├── modules/
│   └── users/
│       ├── application/
│       │   ├── commands/
│       │   │   ├── CreateUserCommand.ts
│       │   │   └── handlers/
│       │   │       └── CreateUserCommandHandler.ts
│       │   └── queries/
│       │       ├── ListUsersQuery.ts
│       │       └── handlers/
│       │           └── ListUsersQueryHandler.ts
│       ├── domain/
│       │   ├── entities/
│       │   │   └── User.ts
│       │   ├── events/
│       │   │   ├── DomainEvent.ts
│       │   │   ├── EventBus.ts
│       │   │   └── UserCreatedEvent.ts
│       │   ├── repositories/
│       │   │   └── UserRepository.ts
│       │   └── value-objects/
│       │       ├── UserName.ts
│       │       └── CommunicationType.ts
│       ├── infrastructure/
│       │   ├── api/
│       │   │   └── userRoutes.ts
│       │   ├── container.ts
│       │   └── repositories/
│       │       └── InMemoryUserRepository.ts
│       └── __tests__/
│           ├── application/
│           │   ├── commands/
│           │   │   └── handlers/
│           │   │       └── CreateUserCommandHandler.test.ts
│           │   └── queries/
│           │       └── handlers/
│           │           └── ListUsersQueryHandler.test.ts
│           ├── domain/
│           │   └── User.test.ts
│           └── infrastructure/
│               └── repositories/
│                   └── InMemoryUserRepository.test.ts
└── index.ts
```

## Guías de Desarrollo

### 1. Estructura de Módulos

Cada módulo debe seguir la estructura de Clean Architecture y CQRS:

- **application/**: Contiene la lógica de aplicación
  - **commands/**: Comandos para modificar el estado
  - **queries/**: Consultas para leer el estado
  - Cada comando/query debe tener su propio handler

- **domain/**: Contiene la lógica de negocio
  - **entities/**: Entidades del dominio
  - **events/**: Eventos del dominio
  - **repositories/**: Interfaces de repositorios
  - **value-objects/**: Objetos de valor

- **infrastructure/**: Implementaciones concretas
  - **api/**: Controladores y rutas
  - **repositories/**: Implementaciones de repositorios
  - **container.ts**: Configuración de dependencias

### 2. Convenciones de Código

- Usar alias de módulos en lugar de rutas relativas:
  ```typescript
  // Correcto
  import { User } from '@users/domain/entities/User';
  
  // Incorrecto
  import { User } from '../../../domain/entities/User';
  ```

- Los nombres de archivos deben seguir el patrón PascalCase para clases y kebab-case para archivos de utilidad.

### 3. Patrones de Diseño

- **CQRS**: Separar comandos (modificaciones) de queries (lecturas)
- **Repository**: Abstraer el acceso a datos
- **Value Objects**: Encapsular reglas de negocio en objetos inmutables
- **Domain Events**: Notificar cambios importantes en el dominio

### 4. Testing

- Los tests deben reflejar la misma estructura que el código fuente
- Usar mocks para dependencias externas
- Seguir el patrón AAA (Arrange, Act, Assert)

### 5. Commits

- Usar mensajes descriptivos
- Referenciar issues cuando sea relevante
- Seguir el formato: `tipo(scope): descripción`

### 6. Pull Requests

- Crear ramas descriptivas
- Incluir descripción clara de los cambios
- Asegurar que todos los tests pasen
- Solicitar review de al menos un desarrollador

## Proceso de Desarrollo

1. Crear una rama desde `main`
2. Implementar cambios siguiendo las guías
3. Ejecutar tests: `npm test`
4. Crear Pull Request
5. Esperar aprobación
6. Merge a `main` 