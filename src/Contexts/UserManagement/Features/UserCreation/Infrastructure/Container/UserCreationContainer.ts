import { CreateUserCommandHandler } from '@userManagement/Features/UserCreation/Application/CommandHandlers/CreateUserCommandHandler';
import { IUserRepository } from '@userManagement/Features/UserCreation/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { CreateUserController } from '@userManagement/Features/UserCreation/Interfaces/Controllers/CreateUserController';

export class UserCreationContainer {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventBus: IEventBus
    ) {}

    public getCreateUserController(): CreateUserController {
        const commandHandler = new CreateUserCommandHandler(
            this.userRepository,
            this.eventBus
        );

        return new CreateUserController(commandHandler);
    }
} 