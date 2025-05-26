import { EditUserCommandHandler } from '../Application/CommandHandlers/EditUserCommandHandler';
import { EditUserCommand } from '../Application/Commands/EditUserCommand';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { UserAggregate } from '@userManagement/Features/UserCreation/Domain/Aggregates/UserAggregate';
import { UserId } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Features/UserCreation/Domain/ValueObjects/CommunicationType';
import { UserNotFoundError } from '@userManagement/Features/UserEditing/Domain/Errors/UserNotFoundError';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { UserEditedEvent } from '../Domain/Events/UserEditedEvent';

describe('EditUserCommandHandler', () => {
    let handler: EditUserCommandHandler;
    let mockUserRepository: jest.Mocked<IUserRepository>;
    let mockEventBus: jest.Mocked<IEventBus>;

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

        handler = new EditUserCommandHandler(mockUserRepository, mockEventBus);
    });

    it('debería editar un usuario existente', async () => {
        // Arrange
        const userId = UserId.create('1');
        const existingUser = UserAggregate.create(
            userId,
            UserName.create('John Doe'),
            CommunicationType.create('EMAIL')
        );

        mockUserRepository.findById.mockResolvedValue(existingUser);
        mockUserRepository.update.mockResolvedValue(existingUser);

        // Act
        const command = new EditUserCommand('1', 'Jane Smith', 'SMS');
        await handler.execute(command);

        // Assert
        expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
        expect(mockUserRepository.update).toHaveBeenCalledWith(userId, expect.any(UserAggregate));
        expect(mockEventBus.publish).toHaveBeenCalledWith([expect.any(UserEditedEvent)]);
    });

    it('debería lanzar error cuando el usuario no existe', async () => {
        // Arrange
        mockUserRepository.findById.mockResolvedValue(null);

        // Act & Assert
        const command = new EditUserCommand('1', 'Jane Smith', 'SMS');
        await expect(handler.execute(command)).rejects.toThrow(UserNotFoundError);
        expect(mockUserRepository.update).not.toHaveBeenCalled();
        expect(mockEventBus.publish).not.toHaveBeenCalled();
    });

    it('debería mantener los valores originales cuando no se proporcionan nuevos valores', async () => {
        // Arrange
        const userId = UserId.create('1');
        const existingUser = UserAggregate.create(
            userId,
            UserName.create('John Doe'),
            CommunicationType.create('EMAIL')
        );

        mockUserRepository.findById.mockResolvedValue(existingUser);
        mockUserRepository.update.mockResolvedValue(existingUser);

        // Act
        const command = new EditUserCommand('1', undefined, undefined);
        await handler.execute(command);

        // Assert
        expect(mockUserRepository.update).toHaveBeenCalledWith(userId, expect.any(UserAggregate));
        expect(mockEventBus.publish).toHaveBeenCalledWith([expect.any(UserEditedEvent)]);
    });

    it('debería manejar errores del repositorio', async () => {
        // Arrange
        const userId = UserId.create('1');
        const existingUser = UserAggregate.create(
            userId,
            UserName.create('John Doe'),
            CommunicationType.create('EMAIL')
        );

        mockUserRepository.findById.mockResolvedValue(existingUser);
        const error = new Error('Error al actualizar usuario');
        mockUserRepository.update.mockRejectedValue(error);

        // Act & Assert
        const command = new EditUserCommand('1', 'Jane Smith', 'SMS');
        await expect(handler.execute(command)).rejects.toThrow('Error al actualizar usuario');
    });
}); 