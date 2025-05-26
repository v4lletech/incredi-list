import { CreateUserController } from '@userManagement/Features/UserCreation/Interfaces/Controllers/CreateUserController';
import { CreateUserCommandHandler } from '@userManagement/Features/UserCreation/Application/CommandHandlers/CreateUserCommandHandler';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { CommandBus } from '@shared/Infrastructure/CommandBus/CommandBus';

export class UserCreationContainer {
    private readonly commandBus: CommandBus;
    private readonly createUserCommandHandler: CreateUserCommandHandler;

    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventBus: IEventBus
    ) {
        this.commandBus = new CommandBus();
        this.createUserCommandHandler = new CreateUserCommandHandler(
            this.userRepository,
            this.eventBus
        );
        
        this.commandBus.register('CreateUserCommand', this.createUserCommandHandler);
    }

    getCreateUserController(): CreateUserController {
        return new CreateUserController(this.commandBus);
    }
} 