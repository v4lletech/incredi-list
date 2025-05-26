import { EditUserCommandHandler } from '@userManagement/Features/UserEditing/Application/CommandHandlers/EditUserCommandHandler';
import { EditUserCommand } from '@userManagement/Features/UserEditing/Application/Commands/EditUserCommand';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { UserAggregate } from '@userManagement/Features/UserCreation/Domain/Aggregates/UserAggregate';
import { UserId } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Features/UserCreation/Domain/ValueObjects/CommunicationType';
import { InvalidInputError } from '@userManagement/Features/UserEditing/Domain/Errors/InvalidInputError';
import { UserNotFoundError } from '@userManagement/Features/UserEditing/Domain/Errors/UserNotFoundError';
import { InvalidUserNameError } from '@userManagement/Features/UserCreation/Domain/Errors/InvalidUserNameError';
import { InvalidCommunicationTypeError } from '@userManagement/Features/UserCreation/Domain/Errors/InvalidCommunicationTypeError';

describe('EditUserCommandHandler', () => {
    let mockUserRepository: jest.Mocked<IUserRepository>;
    let mockEventBus: jest.Mocked<IEventBus>;
    let commandHandler: EditUserCommandHandler;

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

        commandHandler = new EditUserCommandHandler(
            mockUserRepository,
            mockEventBus
        );
    });

    it('debería editar un usuario existente exitosamente', async () => {
        // Arrange
        const existingUser = UserAggregate.create(
            UserId.create('123'),
            UserName.create('John Doe'),
            CommunicationType.create('EMAIL')
        );

        mockUserRepository.findById.mockResolvedValue(existingUser);

        const command = new EditUserCommand(
            '123',
            'Jane Doe',
            'SMS'
        );

        // Act
        await commandHandler.execute(command);

        // Assert
        expect(mockUserRepository.findById).toHaveBeenCalledWith(
            expect.any(UserId)
        );
        expect(mockEventBus.publish).toHaveBeenCalled();
    });

    it('debería lanzar error si faltan campos requeridos', async () => {
        // Arrange
        const command = new EditUserCommand(
            '', // ID vacío
            'Jane Doe',
            'SMS'
        );

        // Act & Assert
        await expect(commandHandler.execute(command)).rejects.toThrow(InvalidInputError);
        expect(mockUserRepository.findById).not.toHaveBeenCalled();
        expect(mockEventBus.publish).not.toHaveBeenCalled();
    });

    it('debería lanzar error si el usuario no existe', async () => {
        // Arrange
        mockUserRepository.findById.mockResolvedValue(null);

        const command = new EditUserCommand(
            '123',
            'Jane Doe',
            'SMS'
        );

        // Act & Assert
        await expect(commandHandler.execute(command)).rejects.toThrow(UserNotFoundError);
        expect(mockEventBus.publish).not.toHaveBeenCalled();
    });

    it('debería lanzar error si el nombre es inválido', async () => {
        // Arrange
        const existingUser = UserAggregate.create(
            UserId.create('123'),
            UserName.create('John Doe'),
            CommunicationType.create('EMAIL')
        );

        mockUserRepository.findById.mockResolvedValue(existingUser);

        const command = new EditUserCommand(
            '123',
            'Jo', // Nombre muy corto
            'SMS'
        );

        // Act & Assert
        await expect(commandHandler.execute(command)).rejects.toThrow(InvalidUserNameError);
        expect(mockEventBus.publish).not.toHaveBeenCalled();
    });

    it('debería lanzar error si el tipo de comunicación es inválido', async () => {
        // Arrange
        const existingUser = UserAggregate.create(
            UserId.create('123'),
            UserName.create('John Doe'),
            CommunicationType.create('EMAIL')
        );

        mockUserRepository.findById.mockResolvedValue(existingUser);

        const command = new EditUserCommand(
            '123',
            'Jane Doe',
            'INVALID_TYPE'
        );

        // Act & Assert
        await expect(commandHandler.execute(command)).rejects.toThrow(InvalidCommunicationTypeError);
        expect(mockEventBus.publish).not.toHaveBeenCalled();
    });

    it('debería manejar errores del repositorio', async () => {
        // Arrange
        const error = new Error('Error de base de datos');
        mockUserRepository.findById.mockRejectedValue(error);

        const command = new EditUserCommand(
            '123',
            'Jane Doe',
            'SMS'
        );

        // Act & Assert
        await expect(commandHandler.execute(command)).rejects.toThrow('Error al editar el usuario: Error de base de datos');
        expect(mockEventBus.publish).not.toHaveBeenCalled();
    });
}); 