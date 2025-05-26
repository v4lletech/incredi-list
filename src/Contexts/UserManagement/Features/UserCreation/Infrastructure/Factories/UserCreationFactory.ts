import { IUserCreationFactory } from './IUserCreationFactory';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { CommandBus } from '@shared/Infrastructure/CommandBus/CommandBus';
import { CreateUserV1Controller } from '@userManagement/Features/UserCreation/Interfaces/Controllers/CreateUserV1Controller';
import { CreateUserV2Controller } from '@userManagement/Features/UserCreation/Interfaces/Controllers/CreateUserV2Controller';
import { CreateUserV1CommandHandler } from '@userManagement/Features/UserCreation/Application/CommandHandlers/CreateUserV1CommandHandler';
import { CreateUserV2CommandHandler } from '@userManagement/Features/UserCreation/Application/CommandHandlers/CreateUserV2CommandHandler';
import { CreateUserV1Command } from '@userManagement/Features/UserCreation/Application/Commands/CreateUserV1Command';
import { CreateUserV2Command } from '@userManagement/Features/UserCreation/Application/Commands/CreateUserV2Command';
import { ICommandHandler } from '@shared/Infrastructure/CommandBus/ICommandHandler';

export class UserCreationFactory implements IUserCreationFactory {
    private readonly commandBus: CommandBus;

    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventBus: IEventBus
    ) {
        this.commandBus = new CommandBus();
    }

    createController(version: string): CreateUserV1Controller | CreateUserV2Controller {
        switch (version) {
            case 'v1':
                return new CreateUserV1Controller(this.commandBus, this);
            case 'v2':
                return new CreateUserV2Controller(this.commandBus, this);
            default:
                throw new Error(`Versión no soportada: ${version}`);
        }
    }

    createCommandHandler(version: string): ICommandHandler<any> {
        switch (version) {
            case 'v1':
                return new CreateUserV1CommandHandler(this.userRepository, this.eventBus);
            case 'v2':
                return new CreateUserV2CommandHandler(this.userRepository, this.eventBus);
            default:
                throw new Error(`Versión no soportada: ${version}`);
        }
    }

    createCommand(version: string, data: any): CreateUserV1Command | CreateUserV2Command {
        switch (version) {
            case 'v1':
                return new CreateUserV1Command(
                    data.name,
                    data.communicationType
                );
            case 'v2':
                return new CreateUserV2Command(
                    data.id,
                    data.name,
                    data.communicationType
                );
            default:
                throw new Error(`Versión no soportada: ${version}`);
        }
    }
} 