import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { InMemoryUserRepository } from '@userManagement/Shared/Infrastructure/Persistence/InMemoryUserRepository';
import { InMemoryEventBus } from '@shared/Infrastructure/EventBus/InMemoryEventBus';
import { ApplicationModule } from '@shared/Infrastructure/Configuration/ApplicationModule';
import { swaggerSpec } from './config/swagger';

const app = express();
const port = process.env.PORT || 3080;

// Middleware
app.use(cors());
app.use(express.json());

// Configuración de Swagger
app.get('/api-docs/swagger.json', (req, res) => res.json(swaggerSpec));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Inicializar dependencias
const userRepository = new InMemoryUserRepository();
const eventBus = new InMemoryEventBus();

// Inicializar módulo de aplicación
const applicationModule = new ApplicationModule(userRepository, eventBus);
applicationModule.initialize();

// Configurar rutas
app.use(applicationModule.getRoutes());

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
    console.log(`Documentación de la API disponible en http://localhost:${port}/api-docs`);
}); 