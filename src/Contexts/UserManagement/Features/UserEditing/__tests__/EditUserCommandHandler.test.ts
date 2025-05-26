import { EditUserCommandHandler } from '../Application/CommandHandlers/EditUserCommandHandler';
import { EditUserCommand } from '../Application/Commands/EditUserCommand';
import { IUserRepository, User } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { UserId } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Features/UserCreation/Domain/ValueObjects/CommunicationType';
import { UserAggregate } from '@userManagement/Features/UserCreation/Domain/Aggregates/UserAggregate';
import { InvalidInputError } from '@userManagement/Features/UserEditing/Domain/Errors/InvalidInputError';
import { UserNotFoundError } from '@userManagement/Features/UserEditing/Domain/Errors/UserNotFoundError';
import { InvalidUserNameError } from '@userManagement/Features/UserCreation/Domain/Errors/InvalidUserNameError';
import { InvalidCommunicationTypeError } from '@userManagement/Features/UserCreation/Domain/Errors/InvalidCommunicationTypeError';

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

    it('should update an existing user', async () => {
        const userId = UserId.create('123');
        const userName = UserName.create('John Doe');
        const communicationType = CommunicationType.create('EMAIL');
        const existingUserAggregate = UserAggregate.create(userId, userName, communicationType);
        const existingUser: User = {
            id: existingUserAggregate.id.value,
            name: existingUserAggregate.name.value,
            communicationType: existingUserAggregate.communicationType.value
        };

        mockUserRepository.findById.mockResolvedValue(existingUser);
        mockUserRepository.update.mockResolvedValue({
            id: '123',
            name: 'Jane Doe',
            communicationType: 'SMS'
        });

        const command = new EditUserCommand('123', 'Jane Doe', 'SMS');
        await handler.execute(command);

        expect(mockUserRepository.findById).toHaveBeenCalledWith('123');
        expect(mockUserRepository.update).toHaveBeenCalledWith(
            '123',
            {
                id: '123',
                name: 'Jane Doe',
                communicationType: 'SMS'
            }
        );
        expect(mockEventBus.publish).toHaveBeenCalled();
    });

    it('should throw error when user not found', async () => {
        mockUserRepository.findById.mockResolvedValue(null);

        const command = new EditUserCommand('123', 'Jane Doe', 'SMS');
        await expect(handler.execute(command)).rejects.toThrow('Usuario no encontrado');
    });

    it('should handle validation errors', async () => {
        const userId = UserId.create('123');
        const userName = UserName.create('John Doe');
        const communicationType = CommunicationType.create('EMAIL');
        const existingUserAggregate = UserAggregate.create(userId, userName, communicationType);
        const existingUser: User = {
            id: existingUserAggregate.id.value,
            name: existingUserAggregate.name.value,
            communicationType: existingUserAggregate.communicationType.value
        };

        mockUserRepository.findById.mockResolvedValue(existingUser);

        const command = new EditUserCommand('123', '', 'INVALID');
        await expect(handler.execute(command)).rejects.toThrow();
    });

    it('should handle repository errors', async () => {
        const userId = UserId.create('123');
        const userName = UserName.create('John Doe');
        const communicationType = CommunicationType.create('EMAIL');
        const existingUserAggregate = UserAggregate.create(userId, userName, communicationType);
        const existingUser: User = {
            id: existingUserAggregate.id.value,
            name: existingUserAggregate.name.value,
            communicationType: existingUserAggregate.communicationType.value
        };

        mockUserRepository.findById.mockResolvedValue(existingUser);
        mockUserRepository.update.mockRejectedValue(new Error('Database error'));

        const command = new EditUserCommand('123', 'Jane Doe', 'SMS');
        await expect(handler.execute(command)).rejects.toThrow('Database error');
    });
}); 