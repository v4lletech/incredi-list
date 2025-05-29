import { UserCreationContainer } from '../Infrastructure/Container/UserCreationContainer';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { CommandBus } from '@shared/Infrastructure/CommandBus/CommandBus';
import { CreateUserV1Controller } from '@userManagement/Features/UserCreation/Interfaces/Controllers/CreateUserV1Controller';
import { CreateUserV2Controller } from '@userManagement/Features/UserCreation/Interfaces/Controllers/CreateUserV2Controller';
import { CreateUserV1Command } from '@userManagement/Features/UserCreation/Application/Commands/CreateUserV1Command';
import { CreateUserV2Command } from '@userManagement/Features/UserCreation/Application/Commands/CreateUserV2Command';

describe('UserCreationContainer', () => {
    let mockUserRepository: jest.Mocked<IUserRepository>;
    let mockEventBus: jest.Mocked<IEventBus>;
    let mockCommandBus: jest.Mocked<CommandBus>;
    let container: UserCreationContainer;

    beforeEach(() => {
        mockUserRepository = {
            create: jest.fn(),
            findById: jest.fn(),
            findByEmail: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        } as unknown as jest.Mocked<IUserRepository>;

        mockEventBus = {
            publish: jest.fn(),
            subscribe: jest.fn(),
            unsubscribe: jest.fn()
        } as jest.Mocked<IEventBus>;

        mockCommandBus = {
            register: jest.fn(),
            dispatch: jest.fn()
        } as unknown as jest.Mocked<CommandBus>;

        container = UserCreationContainer.create(
            mockUserRepository,
            mockEventBus,
            mockCommandBus
        );
    });

    describe('create', () => {
        it('debería crear una instancia del contenedor correctamente', () => {
            // Act
            const newContainer = UserCreationContainer.create(
                mockUserRepository,
                mockEventBus,
                mockCommandBus
            );

            // Assert
            expect(newContainer).toBeInstanceOf(UserCreationContainer);
        });
    });

    describe('initializeCommandHandlers', () => {
        it('debería registrar los manejadores de comandos v1 y v2', () => {
            // Arrange
            const registerSpy = jest.spyOn(mockCommandBus, 'register');

            // Assert
            expect(registerSpy).toHaveBeenCalledTimes(2);
            expect(registerSpy).toHaveBeenCalledWith(CreateUserV1Command.name, expect.any(Object));
            expect(registerSpy).toHaveBeenCalledWith(CreateUserV2Command.name, expect.any(Object));
        });

        it('debería manejar errores durante la inicialización', () => {
            // Arrange
            mockCommandBus.register.mockImplementationOnce(() => {
                throw new Error('Error simulado');
            });

            // Act & Assert
            expect(() => {
                UserCreationContainer.create(
                    mockUserRepository,
                    mockEventBus,
                    mockCommandBus
                );
            }).toThrow('Error simulado');
        });
    });

    describe('getController', () => {
        it('debería devolver un controlador v1 cuando se solicita v1', () => {
            // Act
            const controller = container.getController('v1');

            // Assert
            expect(controller).toBeInstanceOf(CreateUserV1Controller);
        });

        it('debería devolver un controlador v2 cuando se solicita v2', () => {
            // Act
            const controller = container.getController('v2');

            // Assert
            expect(controller).toBeInstanceOf(CreateUserV2Controller);
        });

        it('debería reutilizar el controlador existente en llamadas posteriores', () => {
            // Act
            const controller1 = container.getController('v1');
            const controller2 = container.getController('v1');

            // Assert
            expect(controller1).toBe(controller2);
        });

        it('debería manejar versiones no soportadas', () => {
            // Act & Assert
            expect(() => {
                container.getController('v3');
            }).toThrow('Versión de controlador no soportada: v3');
        });
    });
}); 