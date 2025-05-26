import { CreateUserV2CommandHandler } from '../Application/CommandHandlers/CreateUserV2CommandHandler';
import { CreateUserV2Command } from '../Application/Commands/CreateUserV2Command';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { DomainEvent } from '@shared/Domain/Common/DomainEvent';

describe('CreateUserV2CommandHandler', () => {
    let handler: CreateUserV2CommandHandler;
    let mockUserRepository: jest.Mocked<IUserRepository>;
    let mockEventBus: jest.Mocked<IEventBus>;

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

        handler = new CreateUserV2CommandHandler(mockUserRepository, mockEventBus);
    });

    it('should create and save a new user', async () => {
        const command = new CreateUserV2Command('123', 'John Doe', 'EMAIL');
        
        await handler.handle(command);

        expect(mockUserRepository.save).toHaveBeenCalled();
        expect(mockEventBus.publish).toHaveBeenCalled();
    });
}); 