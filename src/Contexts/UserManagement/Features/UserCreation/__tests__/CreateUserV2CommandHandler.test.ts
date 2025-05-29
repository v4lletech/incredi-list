import { CreateUserV2CommandHandler } from '@userManagement/Features/UserCreation/Application/CommandHandlers/CreateUserV2CommandHandler';
import { CreateUserV2Command } from '@userManagement/Features/UserCreation/Application/Commands/CreateUserV2Command';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { UserAggregate } from '@userManagement/Shared/Domain/Aggregates/UserAggregate';
import { UserCreatedEvent } from '@userManagement/Features/UserCreation/Domain/Events/UserCreatedEvent';
import { InvalidUserIdError } from '@userManagement/Shared/Domain/Errors/InvalidUserIdError';
import { InvalidUserNameError } from '@userManagement/Shared/Domain/Errors/InvalidUserNameError';
import { InvalidCommunicationTypeError } from '@userManagement/Shared/Domain/Errors/InvalidCommunicationTypeError';
import { UserId } from '@userManagement/Shared/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Shared/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Shared/Domain/ValueObjects/CommunicationType';

describe('CreateUserV2CommandHandler', () => {
    let handler: CreateUserV2CommandHandler;
    let userRepository: jest.Mocked<IUserRepository>;
    let eventBus: jest.Mocked<IEventBus>;

    beforeEach(() => {
        userRepository = {
            create: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        };

        eventBus = {
            publish: jest.fn(),
            subscribe: jest.fn(),
            unsubscribe: jest.fn()
        };

        handler = new CreateUserV2CommandHandler(userRepository, eventBus);
    });

    describe('execute', () => {
        it('debería crear un usuario exitosamente', async () => {
            // Arrange
            const command = new CreateUserV2Command('123', 'Juan Pérez', 'EMAIL');
            const mockUser = {
                id: UserId.create('123'),
                name: UserName.create('Juan Pérez'),
                communicationType: CommunicationType.create('EMAIL'),
                toDTO: () => ({
                    id: '123',
                    name: 'Juan Pérez',
                    communicationType: 'EMAIL'
                })
            } as unknown as UserAggregate;
            userRepository.create.mockResolvedValue(mockUser);

            // Act
            const result = await handler.execute(command);

            // Assert
            expect(userRepository.create).toHaveBeenCalled();
            expect(eventBus.publish).toHaveBeenCalledWith(expect.any(UserCreatedEvent));
            expect(result).toBe(mockUser);
            expect(result.id.value).toBe('123');
            expect(result.name.value).toBe('Juan Pérez');
            expect(result.communicationType.value).toBe('EMAIL');
        });

        describe('validaciones de dominio', () => {
            it('debería validar el ID del usuario', async () => {
                // Arrange
                const command = new CreateUserV2Command('', 'Juan Pérez', 'EMAIL');

                // Act & Assert
                await expect(handler.execute(command)).rejects.toThrow(InvalidUserIdError);
                expect(userRepository.create).not.toHaveBeenCalled();
                expect(eventBus.publish).not.toHaveBeenCalled();
            });

            it('debería validar el nombre del usuario', async () => {
                // Arrange
                const command = new CreateUserV2Command('123', 'Jo', 'EMAIL');

                // Act & Assert
                await expect(handler.execute(command)).rejects.toThrow(InvalidUserNameError);
                expect(userRepository.create).not.toHaveBeenCalled();
                expect(eventBus.publish).not.toHaveBeenCalled();
            });

            it('debería validar el tipo de comunicación', async () => {
                // Arrange
                const command = new CreateUserV2Command('123', 'Juan Pérez', 'INVALID_TYPE');

                // Act & Assert
                await expect(handler.execute(command)).rejects.toThrow(InvalidCommunicationTypeError);
                expect(userRepository.create).not.toHaveBeenCalled();
                expect(eventBus.publish).not.toHaveBeenCalled();
            });
        });

        describe('manejo de errores', () => {
            it('debería manejar errores del repositorio', async () => {
                // Arrange
                const command = new CreateUserV2Command('123', 'Juan Pérez', 'EMAIL');
                const error = new Error('Error al crear usuario');
                userRepository.create.mockRejectedValue(error);

                // Act & Assert
                await expect(handler.execute(command)).rejects.toThrow('Error al crear usuario');
                expect(eventBus.publish).not.toHaveBeenCalled();
            });

            it('debería manejar errores del event bus', async () => {
                // Arrange
                const command = new CreateUserV2Command('123', 'Juan Pérez', 'EMAIL');
                const mockUser = {
                    id: UserId.create('123'),
                    name: UserName.create('Juan Pérez'),
                    communicationType: CommunicationType.create('EMAIL'),
                    toDTO: () => ({
                        id: '123',
                        name: 'Juan Pérez',
                        communicationType: 'EMAIL'
                    })
                } as unknown as UserAggregate;
                userRepository.create.mockResolvedValue(mockUser);
                const error = new Error('Error al publicar evento');
                eventBus.publish.mockRejectedValue(error);

                // Act & Assert
                await expect(handler.execute(command)).rejects.toThrow('Error al publicar evento');
            });
        });

        describe('tipos de comunicación válidos', () => {
            it('debería aceptar todos los tipos de comunicación válidos', async () => {
                // Arrange
                const validTypes = ['EMAIL', 'SMS', 'CONSOLE'];

                for (const type of validTypes) {
                    const command = new CreateUserV2Command('123', 'Juan Pérez', type);
                    const mockUser = {
                        id: UserId.create('123'),
                        name: UserName.create('Juan Pérez'),
                        communicationType: CommunicationType.create(type),
                        toDTO: () => ({
                            id: '123',
                            name: 'Juan Pérez',
                            communicationType: type
                        })
                    } as unknown as UserAggregate;
                    userRepository.create.mockResolvedValue(mockUser);

                    // Act
                    const result = await handler.execute(command);

                    // Assert
                    expect(result.communicationType.value).toBe(type);
                    expect(eventBus.publish).toHaveBeenCalledWith(expect.any(UserCreatedEvent));
                }
            });
        });
    });
}); 