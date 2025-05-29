import { CreateUserV1CommandHandler } from '@userManagement/Features/UserCreation/Application/CommandHandlers/CreateUserV1CommandHandler';
import { CreateUserV1Command } from '@userManagement/Features/UserCreation/Application/Commands/CreateUserV1Command';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { UserAggregate } from '@userManagement/Shared/Domain/Aggregates/UserAggregate';
import { UserCreatedEvent } from '@userManagement/Features/UserCreation/Domain/Events/UserCreatedEvent';

describe('CreateUserV1CommandHandler', () => {
    let handler: CreateUserV1CommandHandler;
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

        handler = new CreateUserV1CommandHandler(userRepository, eventBus);
    });

    it('debería crear un usuario exitosamente', async () => {
        // Arrange
        const command = new CreateUserV1Command('Juan Pérez', 'EMAIL');
        const mockUser = jest.fn() as unknown as UserAggregate;
        userRepository.create.mockResolvedValue(mockUser);

        // Act
        const result = await handler.execute(command);

        // Assert
        expect(userRepository.create).toHaveBeenCalled();
        expect(eventBus.publish).toHaveBeenCalledWith(expect.any(UserCreatedEvent));
        expect(result).toBe(mockUser);
    });

    it('debería manejar errores de creación', async () => {
        // Arrange
        const command = new CreateUserV1Command('Juan Pérez', 'EMAIL');
        const error = new Error('Error al crear usuario');
        userRepository.create.mockRejectedValue(error);

        // Act & Assert
        await expect(handler.execute(command)).rejects.toThrow('Error al crear usuario');
        expect(eventBus.publish).not.toHaveBeenCalled();
    });

    it('debería validar el tipo de comunicación', async () => {
        // Arrange
        const command = new CreateUserV1Command('Juan Pérez', 'INVALID_TYPE');

        // Act & Assert
        await expect(handler.execute(command)).rejects.toThrow();
        expect(userRepository.create).not.toHaveBeenCalled();
        expect(eventBus.publish).not.toHaveBeenCalled();
    });

    it('debería validar el nombre del usuario', async () => {
        // Arrange
        const command = new CreateUserV1Command('Jo', 'EMAIL');

        // Act & Assert
        await expect(handler.execute(command)).rejects.toThrow();
        expect(userRepository.create).not.toHaveBeenCalled();
        expect(eventBus.publish).not.toHaveBeenCalled();
    });
}); 