import { Container, interfaces } from 'inversify';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { UserCreationFactory } from '../Factories/UserCreationFactory';
import { CommandBus } from '@shared/Infrastructure/CommandBus/CommandBus';
import { CreateUserV1Controller } from '@userManagement/Features/UserCreation/Interfaces/Controllers/CreateUserV1Controller';
import { CreateUserV2Controller } from '@userManagement/Features/UserCreation/Interfaces/Controllers/CreateUserV2Controller';

export class UserCreationContainer {
    private readonly factory: UserCreationFactory;
    private readonly commandBus: CommandBus;

    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventBus: IEventBus
    ) {
        this.factory = new UserCreationFactory(userRepository, eventBus);
        this.commandBus = new CommandBus();
    }

    getV1Controller(): CreateUserV1Controller {
        const commandHandler = this.factory.createCommandHandler('v1');
        this.commandBus.register('CreateUserV1Command', commandHandler);
        const controller = this.factory.createController('v1');
        if (!(controller instanceof CreateUserV1Controller)) {
            throw new Error('Invalid controller type for V1');
        }
        return controller;
    }

    getV2Controller(): CreateUserV2Controller {
        const commandHandler = this.factory.createCommandHandler('v2');
        this.commandBus.register('CreateUserV2Command', commandHandler);
        const controller = this.factory.createController('v2');
        if (!(controller instanceof CreateUserV2Controller)) {
            throw new Error('Invalid controller type for V2');
        }
        return controller;
    }

    public static register(container: Container): void {
        // Registrar dependencias comunes
        container.bind<IUserRepository>('UserRepository')
            .toDynamicValue(() => {
                // Implementación del repositorio
                return {} as IUserRepository;
            })
            .inSingletonScope();

        container.bind<IEventBus>('EventBus')
            .toDynamicValue(() => {
                // Implementación del event bus
                return {} as IEventBus;
            })
            .inSingletonScope();

        // Registrar el factory
        container.bind<UserCreationFactory>('UserCreationFactory')
            .toDynamicValue((context: interfaces.Context) => {
                const userRepository = context.container.get<IUserRepository>('UserRepository');
                const eventBus = context.container.get<IEventBus>('EventBus');
                return new UserCreationFactory(userRepository, eventBus);
            })
            .inSingletonScope();

        // Registrar el contenedor
        container.bind<UserCreationContainer>('UserCreationContainer')
            .toDynamicValue((context: interfaces.Context) => {
                const userRepository = context.container.get<IUserRepository>('UserRepository');
                const eventBus = context.container.get<IEventBus>('EventBus');
                return new UserCreationContainer(userRepository, eventBus);
            })
            .inSingletonScope();
    }
} 