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

    const v1Controller = container.getV1Controller();
    const v2Controller = container.getV2Controller();

    router.post('/v1/users', (req, res) => v1Controller.handle(req, res));
    router.post('/v2/users', (req, res) => v2Controller.handle(req, res));

    return router;
} 