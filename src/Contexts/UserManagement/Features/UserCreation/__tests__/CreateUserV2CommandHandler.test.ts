import { CreateUserV2CommandHandler } from '@userManagement/Features/UserCreation/Application/CommandHandlers/CreateUserV2CommandHandler';
import { CreateUserV2Command } from '@userManagement/Features/UserCreation/Application/Commands/CreateUserV2Command';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { UserAggregate } from '@userManagement/Features/UserCreation/Domain/Aggregates/UserAggregate';

describe('CreateUserV2CommandHandler', () => {
    let handler: CreateUserV2CommandHandler;
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
            subscribe: jest.fn(),
            unsubscribe: jest.fn()
        };

        handler = new CreateUserV2CommandHandler(mockUserRepository, mockEventBus);
    });

    it('should create a new user', async () => {
        const command = new CreateUserV2Command(
            '123',
            'John Doe',
            'EMAIL'
        );
        
        await handler.execute(command);

        expect(mockUserRepository.create).toHaveBeenCalledWith(
            expect.any(UserAggregate)
        );
        expect(mockEventBus.publish).toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
        const error = new Error('Database error');
        mockUserRepository.create.mockRejectedValue(error);

        const command = new CreateUserV2Command('123', 'John Doe', 'EMAIL');
        
        await expect(handler.execute(command)).rejects.toThrow('Database error');
    });

    it('should handle event bus errors', async () => {
        const error = new Error('Event bus error');
        mockEventBus.publish.mockRejectedValue(error);

        const command = new CreateUserV2Command('123', 'John Doe', 'EMAIL');
        
        await expect(handler.execute(command)).rejects.toThrow('Event bus error');
    });
}); 