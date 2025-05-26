import { UserCreationFactory } from '../Infrastructure/Factories/UserCreationFactory';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { CreateUserV1Controller } from '../Interfaces/Controllers/CreateUserV1Controller';
import { CreateUserV2Controller } from '../Interfaces/Controllers/CreateUserV2Controller';
import { CreateUserV1CommandHandler } from '../Application/CommandHandlers/CreateUserV1CommandHandler';
import { CreateUserV2CommandHandler } from '../Application/CommandHandlers/CreateUserV2CommandHandler';
import { CreateUserV1Command } from '../Application/Commands/CreateUserV1Command';
import { CreateUserV2Command } from '../Application/Commands/CreateUserV2Command';
import { DomainEvent } from '@shared/Domain/Common/DomainEvent';

describe('UserCreationFactory', () => {
    let mockUserRepository: jest.Mocked<IUserRepository>;
    let mockEventBus: jest.Mocked<IEventBus>;
    let factory: UserCreationFactory;

    beforeEach(() => {
        mockUserRepository = {
            save: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            count: jest.fn()
        };

        mockEventBus = {
            publish: jest.fn(),
            subscribe: jest.fn()
        };

        factory = new UserCreationFactory(mockUserRepository, mockEventBus);
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
            expect(() => factory.createController('v3')).toThrow('Versión no soportada: v3');
        });
    });

    describe('createCommandHandler', () => {
        it('debería crear un manejador para la versión 1', () => {
            const handler = factory.createCommandHandler('v1');
            expect(handler).toBeInstanceOf(CreateUserV1CommandHandler);
        });

        it('debería crear un manejador para la versión 2', () => {
            const handler = factory.createCommandHandler('v2');
            expect(handler).toBeInstanceOf(CreateUserV2CommandHandler);
        });

        it('debería lanzar error para versión no soportada', () => {
            expect(() => factory.createCommandHandler('v3')).toThrow('Versión no soportada: v3');
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
                id: '123',
                name: 'John Doe',
                communicationType: 'EMAIL'
            });
            expect(command).toBeInstanceOf(CreateUserV2Command);
            expect((command as CreateUserV2Command).id).toBe('123');
            expect(command.name).toBe('John Doe');
            expect(command.communicationType).toBe('EMAIL');
        });

        it('debería lanzar error para versión no soportada', () => {
            expect(() => factory.createCommand('v3', {})).toThrow('Versión no soportada: v3');
        });
    });
}); 