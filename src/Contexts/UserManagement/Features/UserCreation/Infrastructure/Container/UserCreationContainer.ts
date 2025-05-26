import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { UserCreationFactory } from '../Factories/UserCreationFactory';
import { CommandBus } from '@shared/Infrastructure/CommandBus/CommandBus';
import { CreateUserV1Controller } from '@userManagement/Features/UserCreation/Interfaces/Controllers/CreateUserV1Controller';
import { CreateUserV2Controller } from '@userManagement/Features/UserCreation/Interfaces/Controllers/CreateUserV2Controller';
import { CreateUserV1Command } from '@userManagement/Features/UserCreation/Application/Commands/CreateUserV1Command';
import { CreateUserV2Command } from '@userManagement/Features/UserCreation/Application/Commands/CreateUserV2Command';

export class UserCreationContainer {
    private readonly factory: UserCreationFactory;
    private readonly commandBus: CommandBus;
    private readonly controllers: Map<string, CreateUserV1Controller | CreateUserV2Controller>;

    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventBus: IEventBus
    ) {
        this.commandBus = new CommandBus();
        this.factory = new UserCreationFactory(userRepository, eventBus);
        this.controllers = new Map();
        this.initializeCommandHandlers();
    }

    private initializeCommandHandlers(): void {
        const v1Handler = this.factory.createCommandHandler('v1');
        const v2Handler = this.factory.createCommandHandler('v2');

        this.commandBus.register(CreateUserV1Command.name, v1Handler);
        this.commandBus.register(CreateUserV2Command.name, v2Handler);
    }

    getV1Controller(): CreateUserV1Controller {
        if (!this.controllers.has('v1')) {
            const controller = this.factory.createController('v1');
            if (!(controller instanceof CreateUserV1Controller)) {
                throw new Error('Invalid controller type for V1');
            }
            this.controllers.set('v1', controller);
        }
        return this.controllers.get('v1') as CreateUserV1Controller;
    }

    getV2Controller(): CreateUserV2Controller {
        if (!this.controllers.has('v2')) {
            const controller = this.factory.createController('v2');
            if (!(controller instanceof CreateUserV2Controller)) {
                throw new Error('Invalid controller type for V2');
            }
            this.controllers.set('v2', controller);
        }
        return this.controllers.get('v2') as CreateUserV2Controller;
    }

    public static create(
        userRepository: IUserRepository,
        eventBus: IEventBus
    ): UserCreationContainer {
        return new UserCreationContainer(userRepository, eventBus);
    }
} 