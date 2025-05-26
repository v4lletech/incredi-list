import express from 'express';
import cors from 'cors';
import { InMemoryUserRepository } from '@userManagement/Shared/Infrastructure/Persistence/InMemoryUserRepository';
import { InMemoryEventBus } from '@shared/Infrastructure/EventBus/InMemoryEventBus';
import { ApplicationModule } from '@shared/Infrastructure/Configuration/ApplicationModule';

const app = express();
const port = process.env.PORT || 3080;

// Middleware
app.use(cors());
app.use(express.json());

// Inicializar dependencias
const userRepository = new InMemoryUserRepository();
const eventBus = new InMemoryEventBus();

// Inicializar módulo principal
const applicationModule = new ApplicationModule(userRepository, eventBus);
applicationModule.initialize();

// Usar rutas del módulo principal
app.use(applicationModule.getRoutes());

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
}); 