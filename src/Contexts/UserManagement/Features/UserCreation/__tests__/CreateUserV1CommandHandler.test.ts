import { CreateUserV1CommandHandler } from '../Application/CommandHandlers/CreateUserV1CommandHandler';
import { CreateUserV1Command } from '../Application/Commands/CreateUserV1Command';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { DomainEvent } from '@shared/Domain/Common/DomainEvent';

describe('CreateUserV1CommandHandler', () => {
    let handler: CreateUserV1CommandHandler;
    let mockUserRepository: jest.Mocked<IUserRepository>;
    let mockEventBus: jest.Mocked<IEventBus>;

    beforeEach(() => {
        mockUserRepository = {
            create: jest.fn().mockResolvedValue({
                id: '123',
                name: 'John Doe',
                communicationType: 'EMAIL'
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

        handler = new CreateUserV1CommandHandler(mockUserRepository, mockEventBus);
    });

    it('should create and save a new user', async () => {
        const command = new CreateUserV1Command('John Doe', 'EMAIL');
        
        await handler.execute(command);

        expect(mockUserRepository.create).toHaveBeenCalled();
        expect(mockEventBus.publish).toHaveBeenCalled();
    });
}); 