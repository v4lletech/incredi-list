import { MessagingModule } from '@messaging/Shared/Infrastructure/Configuration/MessagingModule';
import { InMemoryEventBus } from '@shared/Infrastructure/EventBus/InMemoryEventBus';
import { UserCreatedEvent } from '@userManagement/Features/UserCreation/Domain/Events/UserCreatedEvent';
import { UserId } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Features/UserCreation/Domain/ValueObjects/CommunicationType';
import { WelcomeMessageSentEvent } from '@messaging/Features/WelcomeMessage/Domain/Events/WelcomeMessageSentEvent';
import { DomainEvent } from '@shared/Domain/Events/DomainEvent';

describe('MessagingModule Integration', () => {
    let eventBus: InMemoryEventBus;
    let messagingModule: MessagingModule;

    beforeEach(() => {
        eventBus = new InMemoryEventBus();
        messagingModule = new MessagingModule(eventBus);
        messagingModule.initialize();
    });

    it('should handle user creation event and send welcome message', async () => {
        const userId = UserId.create('123');
        const userName = UserName.create('John Doe');
        const communicationType = CommunicationType.create('SMS');
        const event = new UserCreatedEvent(userId, userName, communicationType);
        let welcomeMessageSentEvent: WelcomeMessageSentEvent | undefined;

        eventBus.subscribe(WelcomeMessageSentEvent.name, async (event: DomainEvent) => {
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

    it('debería manejar múltiples eventos de creación de usuario', async () => {
        // Arrange
        const events = [
            new UserCreatedEvent(
                UserId.create('1'),
                UserName.create('John Doe'),
                CommunicationType.create('SMS')
            ),
            new UserCreatedEvent(
                UserId.create('2'),
                UserName.create('Jane Smith'),
                CommunicationType.create('EMAIL')
            ),
            new UserCreatedEvent(
                UserId.create('3'),
                UserName.create('Bob Wilson'),
                CommunicationType.create('CONSOLE')
            )
        ];

        const welcomeMessageSentEvents: WelcomeMessageSentEvent[] = [];

        eventBus.subscribe(WelcomeMessageSentEvent.name, async (event) => {
            if (event instanceof WelcomeMessageSentEvent) {
                welcomeMessageSentEvents.push(event);
            }
        });

        // Act
        await Promise.all(events.map(event => eventBus.publish(event)));

        // Assert
        expect(welcomeMessageSentEvents).toHaveLength(3);
        expect(welcomeMessageSentEvents[0].userId.value).toBe('1');
        expect(welcomeMessageSentEvents[1].userId.value).toBe('2');
        expect(welcomeMessageSentEvents[2].userId.value).toBe('3');
    });
}); 