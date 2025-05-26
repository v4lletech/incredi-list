import { UserCreationFactory } from '../Infrastructure/Factories/UserCreationFactory';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { CreateUserV1Controller } from '../Interfaces/Controllers/CreateUserV1Controller';
import { CreateUserV2Controller } from '../Interfaces/Controllers/CreateUserV2Controller';
import { CreateUserV1CommandHandler } from '../Application/CommandHandlers/CreateUserV1CommandHandler';
import { CreateUserV2CommandHandler } from '../Application/CommandHandlers/CreateUserV2CommandHandler';
import { CreateUserV1Command } from '../Application/Commands/CreateUserV1Command';
import { CreateUserV2Command } from '../Application/Commands/CreateUserV2Command';
import { CommandBus } from '@shared/Infrastructure/CommandBus/CommandBus';

describe('UserCreationFactory', () => {
    let mockUserRepository: jest.Mocked<IUserRepository>;
    let mockEventBus: jest.Mocked<IEventBus>;
    let commandBus: CommandBus;
    let factory: UserCreationFactory;

    beforeEach(() => {
        mockUserRepository = {
            create: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        };

        mockEventBus = {
            publish: jest.fn(),
            subscribe: jest.fn()
        };

        commandBus = new CommandBus();
        factory = new UserCreationFactory(mockUserRepository, mockEventBus, commandBus);
    });

    describe('createController', () => {
        it('debería crear un controlador para la versión 1', () => {
            const controller = factory.createController('v1');
            expect(controller).toBeInstanceOf(CreateUserV1Controller);
        });

        it('debería crear un controlador para la versión 2', () => {
            const controller = factory.createController('v2');
            expect(controller).toBeInstanceOf(CreateUserV2Controller);
        });

        it('debería lanzar error para versión no soportada', () => {
            expect(() => factory.createController('v3')).toThrow('Invalid version: v3');
        });
    });

    describe('createCommandHandler', () => {
        it('debería crear un manejador para la versión 1', () => {
            const handler = factory.createCommandHandler('v1');
            expect(handler).toBeDefined();
        });

        it('debería crear un manejador para la versión 2', () => {
            const handler = factory.createCommandHandler('v2');
            expect(handler).toBeDefined();
        });

        it('debería lanzar error para versión no soportada', () => {
            expect(() => factory.createCommandHandler('v3')).toThrow('Invalid version: v3');
        });
    });

    describe('createCommand', () => {
        it('debería crear un comando para la versión 1', () => {
            const command = factory.createCommand('v1', {
                name: 'John Doe',
                communicationType: 'EMAIL'
            });
            expect(command).toBeInstanceOf(CreateUserV1Command);
            expect(command.name).toBe('John Doe');
            expect(command.communicationType).toBe('EMAIL');
        });

        it('debería crear un comando para la versión 2', () => {
            const command = factory.createCommand('v2', {
                name: 'John Doe',
                communicationType: 'EMAIL',
                preferences: { theme: 'dark' }
            }) as CreateUserV2Command;
            
            expect(command).toBeInstanceOf(CreateUserV2Command);
            expect(command.name).toBe('John Doe');
            expect(command.communicationType).toBe('EMAIL');
            expect(command.preferences).toEqual({ theme: 'dark' });
        });

        it('debería lanzar error para versión no soportada', () => {
            expect(() => factory.createCommand('v3', {})).toThrow('Invalid version: v3');
        });
    });
}); 