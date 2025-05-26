# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-03-20

### Añadido
- Implementación inicial del proyecto Incredi-List
- Arquitectura base con DDD, CQRS y Event Sourcing
- Contexto de UserManagement con las siguientes características:
  - Creación de usuarios (API v1 y v2)
  - Edición de usuarios
  - Listado de usuarios con paginación
- Contexto de Messaging con:
  - Sistema de mensajería con múltiples estrategias (SMS, Email, Console)
  - Mensajes de bienvenida
- Implementación de Event Sourcing
  - Almacenamiento de eventos
  - Reconstrucción de estado
  - Proyecciones
- Tests unitarios con Jest
- Configuración de Docker para desarrollo
- CI/CD con GitHub Actions
- Documentación:
  - README.md
  - CONTRIBUTING.md
  - ARCHITECTURE.md
  - CHANGELOG.md

### Cambiado
- Refactorización de la estructura del proyecto para seguir DDD
- Mejora en la implementación de repositorios
- Actualización de la documentación

### Corregido
- Errores en la validación de usuarios
- Problemas de consistencia en el Event Store
- Bugs en la paginación de usuarios

## [0.2.0] - 2024-03-15

### Añadido
- Implementación de CQRS
- Sistema de mensajería
- Tests de integración

### Cambiado
- Refactorización de la capa de aplicación
- Mejora en el manejo de errores

## [0.1.0] - 2024-03-10

### Añadido
- Estructura inicial del proyecto
- Implementación básica de DDD
- Gestión de usuarios básica
- Tests unitarios iniciales

### Cambiado
- Configuración inicial del proyecto
- Estructura de directorios

## [0.0.1] - 2024-03-01

### Añadido
- Inicialización del proyecto
- Configuración básica de TypeScript
- Estructura de directorios inicial
- Configuración de Docker 