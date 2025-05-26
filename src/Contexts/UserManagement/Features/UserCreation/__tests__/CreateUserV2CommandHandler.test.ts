import { CreateUserV2CommandHandler } from '../Application/CommandHandlers/CreateUserV2CommandHandler';
import { CreateUserV2Command } from '../Application/Commands/CreateUserV2Command';
import { IUserRepository, User } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { UserId } from '../Domain/ValueObjects/UserId';
import { UserName } from '../Domain/ValueObjects/UserName';
import { CommunicationType } from '../Domain/ValueObjects/CommunicationType';
import { UserAggregate } from '../Domain/Aggregates/UserAggregate';

describe('CreateUserV2CommandHandler', () => {
    let handler: CreateUserV2CommandHandler;
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

        handler = new CreateUserV2CommandHandler(mockUserRepository, mockEventBus);
    });

    it('should create a new user', async () => {
        const command = new CreateUserV2Command(
            '123',
            'John Doe',
            'EMAIL'
        );
        
        await handler.execute(command);

        expect(mockUserRepository.create).toHaveBeenCalledWith({
            id: '123',
            name: 'John Doe',
            communicationType: 'EMAIL'
        });
        expect(mockEventBus.publish).toHaveBeenCalled();
    });
}); 