import { CreateUserV1CommandHandler } from '../Application/CommandHandlers/CreateUserV1CommandHandler';
import { CreateUserV1Command } from '../Application/Commands/CreateUserV1Command';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { UserAggregate } from '../Domain/Aggregates/UserAggregate';
import { UserId } from '../Domain/ValueObjects/UserId';
import { UserName } from '../Domain/ValueObjects/UserName';
import { CommunicationType } from '../Domain/ValueObjects/CommunicationType';

describe('CreateUserV1CommandHandler', () => {
    let handler: CreateUserV1CommandHandler;
    let mockUserRepository: jest.Mocked<IUserRepository>;
    let mockEventBus: jest.Mocked<IEventBus>;

    beforeEach(() => {
        mockUserRepository = {
            create: jest.fn().mockImplementation(async (user: UserAggregate) => user),
            findById: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        };

        mockEventBus = {
            publish: jest.fn(),
            subscribe: jest.fn()
        };

        handler = new CreateUserV1CommandHandler(mockUserRepository, mockEventBus);
    });

    it('should create and save a new user', async () => {
        const command = new CreateUserV1Command('John Doe', 'EMAIL');
        
        await handler.execute(command);

        expect(mockUserRepository.create).toHaveBeenCalledWith(
            expect.any(UserAggregate)
        );
        expect(mockEventBus.publish).toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
        const error = new Error('Database error');
        mockUserRepository.create.mockRejectedValue(error);

        const command = new CreateUserV1Command('John Doe', 'EMAIL');
        
        await expect(handler.execute(command)).rejects.toThrow('Database error');
    });

    it('should handle event bus errors', async () => {
        const error = new Error('Event bus error');
        mockEventBus.publish.mockRejectedValue(error);

        const command = new CreateUserV1Command('John Doe', 'EMAIL');
        
        await expect(handler.execute(command)).rejects.toThrow('Event bus error');
    });
}); 