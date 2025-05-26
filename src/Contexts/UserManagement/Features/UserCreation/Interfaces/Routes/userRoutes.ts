import { Router } from 'express';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { CommandBus } from '@shared/Infrastructure/CommandBus/CommandBus';
import { UserCreationContainer } from '@userManagement/Features/UserCreation/Infrastructure/Container/UserCreationContainer';

export function userRoutes(
    commandBus: CommandBus,
    userRepository: IUserRepository,
    eventBus: IEventBus
): Router {
    const router = Router();
    const container = new UserCreationContainer(userRepository, eventBus);

    // Rutas para v1
    router.post('/v1/users', (req, res) => {
        const controller = container.getController('v1');
        controller.handle(req, res);
    });

    // Rutas para v2
    router.post('/v2/users', (req, res) => {
        const controller = container.getController('v2');
        controller.handle(req, res);
    });

    return router;
} 