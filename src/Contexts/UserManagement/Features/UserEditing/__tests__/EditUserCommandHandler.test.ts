import { EditUserCommandHandler } from '@userManagement/Features/UserEditing/Application/CommandHandlers/EditUserCommandHandler';
import { EditUserCommand } from '@userManagement/Features/UserEditing/Application/Commands/EditUserCommand';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { UserAggregate } from '@userManagement/Shared/Domain/Aggregates/UserAggregate';
import { UserId } from '@userManagement/Shared/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Shared/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Shared/Domain/ValueObjects/CommunicationType';
import { UserEditedEvent } from '@userManagement/Features/UserEditing/Domain/Events/UserEditedEvent';
import { UserNotFoundError } from '@userManagement/Features/UserEditing/Domain/Errors/UserNotFoundError';
import { InvalidInputError } from '@userManagement/Features/UserEditing/Domain/Errors/InvalidInputError';
import { InvalidUserIdError } from '@userManagement/Shared/Domain/Errors/InvalidUserIdError';
import { InvalidUserNameError } from '@userManagement/Shared/Domain/Errors/InvalidUserNameError';
import { InvalidCommunicationTypeError } from '@userManagement/Shared/Domain/Errors/InvalidCommunicationTypeError';

describe('EditUserCommandHandler', () => {
    let handler: EditUserCommandHandler;
    let userRepository: jest.Mocked<IUserRepository>;
    let eventBus: jest.Mocked<IEventBus>;
    let mockUser: UserAggregate;

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

        const id = UserId.create('123');
        const name = UserName.create('Juan Pérez');
        const communicationType = CommunicationType.create('EMAIL');
        mockUser = UserAggregate.create(id, name, communicationType);

        handler = new EditUserCommandHandler(userRepository, eventBus);
    });

    it('debería actualizar un usuario exitosamente', async () => {
        // Arrange
        const command = new EditUserCommand('123', 'Juan Pérez Actualizado', 'SMS');
        userRepository.findById.mockResolvedValue(mockUser);
        userRepository.update.mockResolvedValue(mockUser);

        // Act
        const result = await handler.execute(command);

        // Assert
        expect(userRepository.findById).toHaveBeenCalledWith(expect.any(UserId));
        expect(userRepository.update).toHaveBeenCalled();
        expect(eventBus.publish).toHaveBeenCalledWith(expect.any(UserEditedEvent));
        expect(result).toBe(mockUser);
    });

    it('debería lanzar error si el usuario no existe', async () => {
        // Arrange
        const command = new EditUserCommand('123', 'Juan Pérez Actualizado', 'SMS');
        userRepository.findById.mockResolvedValue(null);

        // Act & Assert
        await expect(handler.execute(command)).rejects.toThrow(UserNotFoundError);
        expect(userRepository.update).not.toHaveBeenCalled();
        expect(eventBus.publish).not.toHaveBeenCalled();
    });

    it('debería lanzar error si no se proporciona ID', async () => {
        // Arrange
        const command = new EditUserCommand('', 'Juan Pérez Actualizado', 'SMS');

        // Act & Assert
        await expect(handler.execute(command)).rejects.toThrow(InvalidInputError);
        expect(userRepository.findById).not.toHaveBeenCalled();
        expect(userRepository.update).not.toHaveBeenCalled();
        expect(eventBus.publish).not.toHaveBeenCalled();
    });

    it('debería mantener valores existentes si no se proporcionan nuevos', async () => {
        // Arrange
        const command = new EditUserCommand('123', undefined, undefined);
        userRepository.findById.mockResolvedValue(mockUser);
        userRepository.update.mockResolvedValue(mockUser);

        // Act
        const result = await handler.execute(command);

        // Assert
        expect(userRepository.findById).toHaveBeenCalledWith(expect.any(UserId));
        expect(userRepository.update).toHaveBeenCalled();
        expect(eventBus.publish).toHaveBeenCalledWith(expect.any(UserEditedEvent));
        expect(result).toBe(mockUser);
    });

    it('debería validar el tipo de comunicación', async () => {
        // Arrange
        const command = new EditUserCommand('123', 'Juan Pérez', 'INVALID_TYPE');
        userRepository.findById.mockResolvedValue(mockUser);

        // Act & Assert
        await expect(handler.execute(command)).rejects.toThrow(InvalidInputError);
        expect(userRepository.update).not.toHaveBeenCalled();
        expect(eventBus.publish).not.toHaveBeenCalled();
    });

    it('debería validar el nombre del usuario', async () => {
        // Arrange
        const command = new EditUserCommand('123', 'Jo', 'EMAIL');
        userRepository.findById.mockResolvedValue(mockUser);

        // Act & Assert
        await expect(handler.execute(command)).rejects.toThrow(InvalidInputError);
        expect(userRepository.update).not.toHaveBeenCalled();
        expect(eventBus.publish).not.toHaveBeenCalled();
    });

    it('debería manejar errores del repositorio', async () => {
        // Arrange
        const command = new EditUserCommand('123', 'Juan Pérez Actualizado', 'SMS');
        userRepository.findById.mockResolvedValue(mockUser);
        userRepository.update.mockRejectedValue(new Error('Error de base de datos'));

        // Act & Assert
        await expect(handler.execute(command)).rejects.toThrow('Error al editar el usuario: Error de base de datos');
        expect(eventBus.publish).not.toHaveBeenCalled();
    });

    it('debería manejar errores del eventBus', async () => {
        // Arrange
        const command = new EditUserCommand('123', 'Juan Pérez Actualizado', 'SMS');
        userRepository.findById.mockResolvedValue(mockUser);
        userRepository.update.mockResolvedValue(mockUser);
        eventBus.publish.mockRejectedValue(new Error('Error al publicar evento'));

        // Act & Assert
        await expect(handler.execute(command)).rejects.toThrow('Error al editar el usuario: Error al publicar evento');
    });

    it('debería actualizar solo el nombre cuando solo se proporciona nombre', async () => {
        // Arrange
        const command = new EditUserCommand('123', 'Juan Pérez Actualizado', undefined);
        userRepository.findById.mockResolvedValue(mockUser);
        userRepository.update.mockResolvedValue(mockUser);

        // Act
        const result = await handler.execute(command);

        // Assert
        expect(userRepository.update).toHaveBeenCalled();
        expect(eventBus.publish).toHaveBeenCalledWith(expect.any(UserEditedEvent));
        expect(result).toBe(mockUser);
    });

    it('debería actualizar solo el tipo de comunicación cuando solo se proporciona tipo de comunicación', async () => {
        // Arrange
        const command = new EditUserCommand('123', undefined, 'SMS');
        userRepository.findById.mockResolvedValue(mockUser);
        userRepository.update.mockResolvedValue(mockUser);

        // Act
        const result = await handler.execute(command);

        // Assert
        expect(userRepository.update).toHaveBeenCalled();
        expect(eventBus.publish).toHaveBeenCalledWith(expect.any(UserEditedEvent));
        expect(result).toBe(mockUser);
    });
}); 