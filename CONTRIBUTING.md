# Guía de Contribución

## 1. Antes de Contribuir

### 1.1 Revisión del Proyecto
- Familiarízate con la estructura del proyecto y sus patrones de diseño
- Revisa la documentación existente
- Asegúrate de no duplicar funcionalidad existente
- Sigue las convenciones de código establecidas

### 1.2 Estándares de Código
- Usa TypeScript con configuración estricta
- Sigue el estilo de código definido en `.prettierrc`
- Mantén la cobertura de tests por encima del 85%
- Documenta las clases y métodos públicos

## 2. Proceso de Desarrollo

### 2.1 Flujo de Trabajo
1. Crear rama desde `main`
2. Implementar cambios
3. Ejecutar tests
4. Crear Pull Request
5. Esperar aprobación
6. Merge a `main`

### 2.2 Convenciones de Commits
```
tipo(scope): descripción

[body]

[footer]
```

Tipos:
- feat: Nueva característica
- fix: Corrección de bug
- docs: Documentación
- style: Formato
- refactor: Refactorización
- test: Tests
- chore: Tareas de mantenimiento

### 2.3 Pull Requests
- Descripción clara de cambios
- Referencia a issues relacionados
- Tests incluidos
- Documentación actualizada
- Revisión de al menos un desarrollador

## 3. Testing

### 3.1 Tests Unitarios
- Los tests deben reflejar la misma estructura que el código fuente
- Usar mocks para dependencias externas
- Seguir el patrón AAA (Arrange, Act, Assert)

### 3.2 Tests de Integración
- Probar flujos completos
- Verificar interacciones entre componentes
- Validar comportamiento del sistema

## 4. Herramientas y Configuración

### 4.1 Desarrollo
- Node.js 18.x
- TypeScript
- Docker
- VS Code con extensiones recomendadas

### 4.2 Testing
- Jest
- ts-jest
- Supertest

### 4.3 CI/CD
- GitHub Actions
- Docker
- SonarQube

## 5. Recursos Adicionales

### 5.1 Documentación
- [DDD Reference](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [CQRS Pattern](https://martinfowler.com/bliki/CQRS.html)
- [Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html)

### 5.2 Herramientas
- [TypeScript](https://www.typescriptlang.org/)
- [Jest](https://jestjs.io/)
- [Docker](https://www.docker.com/)