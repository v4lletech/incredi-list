import { CreateUserCommandHandler } from '@userManagement/Features/UserCreation/Application/CommandHandlers/CreateUserCommandHandler';
import { CreateUserCommand } from '@userManagement/Features/UserCreation/Application/Commands/CreateUserCommand';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { UserAggregate } from '@userManagement/Features/UserCreation/Domain/Aggregates/UserAggregate';
import { UserCreatedEvent } from '@userManagement/Features/UserCreation/Domain/Events/UserCreatedEvent';
import { InvalidUserNameError } from '@userManagement/Features/UserCreation/Domain/Errors/InvalidUserNameError';
import { InvalidCommunicationTypeError } from '@userManagement/Features/UserCreation/Domain/Errors/InvalidCommunicationTypeError';
import { InvalidUserIdError } from '@userManagement/Features/UserCreation/Domain/Errors/InvalidUserIdError';

describe('CreateUserCommandHandler', () => {
    let mockUserRepository: jest.Mocked<IUserRepository>;
    let mockEventBus: jest.Mocked<IEventBus>;
    let commandHandler: CreateUserCommandHandler;

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

        commandHandler = new CreateUserCommandHandler(
            mockUserRepository,
            mockEventBus
        );
    });

    it('debería crear un usuario y publicar el evento', async () => {
        const command = new CreateUserCommand(
            '123',
            'John Doe',
            'EMAIL'
        );

        await commandHandler.execute(command);

        expect(mockUserRepository.save).toHaveBeenCalledWith(
            expect.any(UserAggregate)
        );

        const savedUser = mockUserRepository.save.mock.calls[0][0] as UserAggregate;
        expect(savedUser.id.toString()).toBe('123');
        expect(savedUser.name.toString()).toBe('John Doe');
        expect(savedUser.communicationType.toString()).toBe('EMAIL');

        expect(mockEventBus.publish).toHaveBeenCalledWith(
            expect.arrayContaining([
                expect.any(UserCreatedEvent)
            ])
        );

        const publishedEvent = mockEventBus.publish.mock.calls[0][0][0] as UserCreatedEvent;
        expect(publishedEvent.userId.toString()).toBe('123');
        expect(publishedEvent.name.toString()).toBe('John Doe');
        expect(publishedEvent.communicationType.toString()).toBe('EMAIL');
    });

    it('debería lanzar error si el nombre es inválido', async () => {
        const command = new CreateUserCommand(
            '123',
            'Jo', // Nombre muy corto
            'EMAIL'
        );

        await expect(commandHandler.execute(command)).rejects.toThrow(InvalidUserNameError);
        expect(mockUserRepository.save).not.toHaveBeenCalled();
        expect(mockEventBus.publish).not.toHaveBeenCalled();
    });

    it('debería lanzar error si el tipo de comunicación es inválido', async () => {
        const command = new CreateUserCommand(
            '123',
            'John Doe',
            'INVALID_TYPE'
        );

        await expect(commandHandler.execute(command)).rejects.toThrow(InvalidCommunicationTypeError);
        expect(mockUserRepository.save).not.toHaveBeenCalled();
        expect(mockEventBus.publish).not.toHaveBeenCalled();
    });

    it('debería manejar errores del repositorio', async () => {
        const command = new CreateUserCommand(
            '123',
            'John Doe',
            'EMAIL'
        );

        const error = new Error('Error de base de datos');
        mockUserRepository.save.mockRejectedValueOnce(error);

        await expect(commandHandler.execute(command)).rejects.toThrow('Error al crear el usuario: Error de base de datos');
        expect(mockEventBus.publish).not.toHaveBeenCalled();
    });

    it('debería lanzar error si faltan campos requeridos', async () => {
        const command = new CreateUserCommand(
            '', // ID vacío
            'John Doe',
            'EMAIL'
        );

        await expect(commandHandler.execute(command)).rejects.toThrow(InvalidUserIdError);
        expect(mockUserRepository.save).not.toHaveBeenCalled();
        expect(mockEventBus.publish).not.toHaveBeenCalled();
    });

    it('debería lanzar error si el ID es undefined', async () => {
        const command = new CreateUserCommand(
            undefined as unknown as string,
            'John Doe',
            'EMAIL'
        );

        await expect(commandHandler.execute(command)).rejects.toThrow(InvalidUserIdError);
        expect(mockUserRepository.save).not.toHaveBeenCalled();
        expect(mockEventBus.publish).not.toHaveBeenCalled();
    });

    it('debería lanzar error si el nombre es undefined', async () => {
        const command = new CreateUserCommand(
            '123',
            undefined as unknown as string,
            'EMAIL'
        );

        await expect(commandHandler.execute(command)).rejects.toThrow(InvalidUserIdError);
        expect(mockUserRepository.save).not.toHaveBeenCalled();
        expect(mockEventBus.publish).not.toHaveBeenCalled();
    });

    it('debería lanzar error si el tipo de comunicación es undefined', async () => {
        const command = new CreateUserCommand(
            '123',
            'John Doe',
            undefined as unknown as string
        );

        await expect(commandHandler.execute(command)).rejects.toThrow(InvalidUserIdError);
        expect(mockUserRepository.save).not.toHaveBeenCalled();
        expect(mockEventBus.publish).not.toHaveBeenCalled();
    });
}); 