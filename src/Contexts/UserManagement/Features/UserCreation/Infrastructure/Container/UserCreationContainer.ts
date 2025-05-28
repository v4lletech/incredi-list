import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { UserCreationFactory } from '@userManagement/Features/UserCreation/Infrastructure/Factories/oldUserCreationFactory';
import { CommandBus } from '@shared/Infrastructure/CommandBus/CommandBus';
import { CreateUserV1Controller } from '@userManagement/Features/UserCreation/Interfaces/Controllers/CreateUserV1Controller';
import { CreateUserV2Controller } from '@userManagement/Features/UserCreation/Interfaces/Controllers/CreateUserV2Controller';
import { CreateUserV1Command } from '@userManagement/Features/UserCreation/Application/Commands/CreateUserV1Command';
import { CreateUserV2Command } from '@userManagement/Features/UserCreation/Application/Commands/CreateUserV2Command';
import ICreateUserController from '../../../../../Shared/Interfaces/Controllers/IController';

export class UserCreationContainer {
    private readonly factory: UserCreationFactory;
    private readonly controllers: Map<string, CreateUserV1Controller | CreateUserV2Controller>;

    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventBus: IEventBus,
        private readonly commandBus: CommandBus
    ) {
        this.factory = new UserCreationFactory(userRepository, eventBus, commandBus);
        this.controllers = new Map();
        this.initializeCommandHandlers();
    }

    private initializeCommandHandlers(): void {
        try {
            // Crear y registrar los manejadores de comandos
            const v1Handler = this.factory.createCommandHandler('v1');
            const v2Handler = this.factory.createCommandHandler('v2');

            // Registrar los manejadores usando el nombre de la clase del comando
            this.commandBus.register(CreateUserV1Command.name, v1Handler);
            this.commandBus.register(CreateUserV2Command.name, v2Handler);

            console.log('Command handlers initialized successfully');
        } catch (error) {
            console.error('Error initializing command handlers:', error);
            throw error;
        }
    }

    getController(version: string): ICreateUserController {
        if (!this.controllers.has(version)) {
            const controller = version === 'v1' 
                ? new CreateUserV1Controller(this.commandBus)
                : new CreateUserV2Controller(this.commandBus);
            this.controllers.set(version, controller);
        }
        return this.controllers.get(version)!;
    }

    public static create(
        userRepository: IUserRepository,
        eventBus: IEventBus,
        commandBus: CommandBus
    ): UserCreationContainer {
        return new UserCreationContainer(userRepository, eventBus, commandBus);
    }
} 