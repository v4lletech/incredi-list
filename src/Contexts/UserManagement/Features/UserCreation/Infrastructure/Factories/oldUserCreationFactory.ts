import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { IUserCreationFactory } from '@userManagement/Features/UserCreation/Infrastructure/Factories/oldIUserCreationFactory';
import { CreateUserV1Controller } from '@userManagement/Features/UserCreation/Interfaces/Controllers/CreateUserV1Controller';
import { CreateUserV2Controller } from '@userManagement/Features/UserCreation/Interfaces/Controllers/CreateUserV2Controller';
import { CreateUserV1Command } from '@userManagement/Features/UserCreation/Application/Commands/CreateUserV1Command';
import { CreateUserV2Command } from '@userManagement/Features/UserCreation/Application/Commands/CreateUserV2Command';
import { CommandBus } from '@shared/Infrastructure/CommandBus/CommandBus';
import { CreateUserV1CommandHandler } from '@userManagement/Features/UserCreation/Application/CommandHandlers/CreateUserV1CommandHandler';
import { CreateUserV2CommandHandler } from '@userManagement/Features/UserCreation/Application/CommandHandlers/CreateUserV2CommandHandler';

export class UserCreationFactory implements IUserCreationFactory {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventBus: IEventBus,
        private readonly commandBus: CommandBus
    ) {}

    createController(version: 'v1' | 'v2') {
        switch (version) {
            case 'v1':
                return new CreateUserV1Controller(this.commandBus);
            case 'v2':
                return new CreateUserV2Controller(this.commandBus);
            default:
                throw new Error(`Invalid version: ${version}`);
        }
    }

    createCommandHandler(version: 'v1' | 'v2') {
        switch (version) {
            case 'v1':
                return new CreateUserV1CommandHandler(this.userRepository, this.eventBus);
            case 'v2':
                return new CreateUserV2CommandHandler(this.userRepository, this.eventBus);
            default:
                throw new Error(`Invalid version: ${version}`);
        }
    }

    createCommand(version: 'v1' | 'v2', data: any) {
        switch (version) {
            case 'v1':
                return new CreateUserV1Command(data.name, data.communicationType);
            case 'v2':
                return new CreateUserV2Command(data.id, data.name, data.communicationType);
            default:
                throw new Error(`Invalid version: ${version}`);
        }
    }
} 