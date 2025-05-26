import { CreateUserV2CommandHandler } from '../Application/CommandHandlers/CreateUserV2CommandHandler';
import { CreateUserV2Command } from '../Application/Commands/CreateUserV2Command';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';

describe('CreateUserV2CommandHandler', () => {
    let handler: CreateUserV2CommandHandler;
    let mockUserRepository: jest.Mocked<IUserRepository>;
    let mockEventBus: jest.Mocked<IEventBus>;

    beforeEach(() => {
        mockUserRepository = {
            create: jest.fn().mockResolvedValue({
                id: '123',
                name: 'John Doe',
                communicationType: 'EMAIL',
                preferences: { theme: 'dark' }
            }),
            findById: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        };

        mockEventBus = {
            publish: jest.fn(),
            subscribe: jest.fn()
        };

        handler = new CreateUserV2CommandHandler(mockUserRepository, mockEventBus);
    });

    it('should create a new user with preferences', async () => {
        const command = new CreateUserV2Command(
            'John Doe',
            'EMAIL',
            { theme: 'dark' }
        );
        
        await handler.handle(command);

        expect(mockUserRepository.create).toHaveBeenCalledWith({
            name: 'John Doe',
            communicationType: 'EMAIL',
            preferences: { theme: 'dark' }
        });
        expect(mockEventBus.publish).toHaveBeenCalled();
    });
}); 