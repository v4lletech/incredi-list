import express, { Router } from 'express';
import 'module-alias/register';
import { createUserRoutes } from '@userManagement/Features/UserCreation/Interfaces/Routes/userRoutes';
import { UserCreationContainer } from '@userManagement/Features/UserCreation/Infrastructure/Container/UserCreationContainer';
import { createUserListingRoutes } from '@userManagement/Features/UserListing/Interfaces/Routes/userListingRoutes';
import { UserListingContainer } from '@userManagement/Features/UserListing/Infrastructure/Container/UserListingContainer';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { createEditUserRoutes } from '@userManagement/Features/UserEditing/Infrastructure/Routes/editUserRoutes';
import { UserEditingContainer } from '@userManagement/Features/UserEditing/Infrastructure/Container/UserEditingContainer';
import { WelcomeMessageContainer } from '@messaging/Features/WelcomeMessage/Infrastructure/Container/WelcomeMessageContainer';

const app = express();
const port = process.env.PORT || 3080;

// Middleware
app.use(express.json());

// Configurar módulos
const configureUserCreationModule = (
    userRepository: IUserRepository,
    eventBus: IEventBus
) => {
    const container = new UserCreationContainer(userRepository, eventBus);
    const createUserController = container.getCreateUserController();
    return createUserRoutes(createUserController);
};

const configureUserListingModule = (
    userRepository: IUserRepository
) => {
    const container = new UserListingContainer(userRepository);
    const listUsersController = container.getListUsersController();
    return createUserListingRoutes(listUsersController);
};

function configureUserEditingModule(userRepository: IUserRepository, eventBus: IEventBus): Router {
    const container = new UserEditingContainer(userRepository, eventBus);
    return createEditUserRoutes(container);
}

function configureWelcomeMessageModule(eventBus: IEventBus): void {
    const container = new WelcomeMessageContainer(eventBus);
    container.initialize();
}

// Routes
app.use('/api/users', configureUserCreationModule(
    // Aquí se inyectarían las implementaciones concretas de IUserRepository e IEventBus
    // Por ahora son placeholders que deberán ser implementados
    {} as IUserRepository,
    {} as IEventBus
));

app.use('/api/users', configureUserListingModule(
    // Aquí se inyectaría la implementación concreta de IUserRepository
    {} as IUserRepository
));

app.use('/api/users', configureUserEditingModule(
    // Aquí se inyectaría la implementación concreta de IUserRepository
    {} as IUserRepository,
    {} as IEventBus
));

// Inicializar el módulo de mensajes de bienvenida
configureWelcomeMessageModule({} as IEventBus);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 