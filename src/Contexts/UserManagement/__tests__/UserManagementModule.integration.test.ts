import { UserManagementModule } from '@userManagement/Shared/Infrastructure/Configuration/UserManagementModule';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { InMemoryEventBus } from '@shared/Infrastructure/EventBus/InMemoryEventBus';
import { CommandBus } from '@shared/Infrastructure/CommandBus/CommandBus';
import { UserCreatedEvent } from '@userManagement/Features/UserCreation/Domain/Events/UserCreatedEvent';
import { UserId } from '@userManagement/Shared/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Shared/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Shared/Domain/ValueObjects/CommunicationType';
import { WelcomeMessageSentEvent } from '@messaging/Features/WelcomeMessage/Domain/Events/WelcomeMessageSentEvent';
import { DomainEvent } from '@shared/Domain/Events/DomainEvent';
import { MessagingModule } from '@messaging/Shared/Infrastructure/Configuration/MessagingModule';

jest.mock('@userManagement/Features/UserCreation/Infrastructure/Container/UserCreationContainer');
jest.mock('@userManagement/Features/UserListing/Infrastructure/Container/UserListingContainer');
jest.mock('@userManagement/Features/UserEditing/Infrastructure/Container/UserEditingContainer');

describe('UserManagementModule Integration', () => {
    let userRepository: jest.Mocked<IUserRepository>;
    let eventBus: InMemoryEventBus;
    let commandBus: CommandBus;
    let userManagementModule: UserManagementModule;
    let messagingModule: MessagingModule;

    beforeEach(() => {
        userRepository = {
            create: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        };
        eventBus = new InMemoryEventBus();
        commandBus = new CommandBus();
        userManagementModule = new UserManagementModule(commandBus, userRepository, eventBus);
        messagingModule = new MessagingModule(eventBus);
        userManagementModule.initialize();
        messagingModule.initialize();
    });

    it('should handle user creation event and send welcome message', async () => {
        const userId = UserId.create('123');
        const userName = UserName.create('John Doe');
        const communicationType = CommunicationType.create('SMS');
        const event = new UserCreatedEvent(userId, userName, communicationType);
        let welcomeMessageSentEvent: WelcomeMessageSentEvent | undefined;

        eventBus.subscribe('WelcomeMessageSentEvent', async (event: DomainEvent) => {
            if (event instanceof WelcomeMessageSentEvent) {
                welcomeMessageSentEvent = event;
            }
        });

        await eventBus.publish(event);

        expect(welcomeMessageSentEvent).toBeDefined();
        expect(welcomeMessageSentEvent?.userId).toEqual(userId);
        expect(welcomeMessageSentEvent?.userName).toEqual(userName);
        expect(welcomeMessageSentEvent?.communicationType).toEqual(communicationType);
        expect(welcomeMessageSentEvent?.message).toContain(userName.value);
    });
}); 