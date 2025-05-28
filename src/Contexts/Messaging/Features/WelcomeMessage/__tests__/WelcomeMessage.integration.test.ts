import { WelcomeMessageService } from '@messaging/Features/WelcomeMessage/Application/Services/WelcomeMessageService';
import { EmailMessageStrategy } from '@messaging/Shared/Domain/Strategies/EmailMessageStrategy';
import { SMSMessageStrategy } from '@messaging/Shared/Domain/Strategies/SMSMessageStrategy';
import { ConsoleMessageStrategy } from '@messaging/Shared/Domain/Strategies/ConsoleMessageStrategy';
import { InMemoryEventBus } from '@shared/Infrastructure/EventBus/InMemoryEventBus';
import { UserCreatedEvent } from '@userManagement/Features/UserCreation/Domain/Events/UserCreatedEvent';
import { UserId } from '@userManagement/Shared/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Shared/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Shared/Domain/ValueObjects/CommunicationType';
import { WelcomeMessageSentEvent } from '@messaging/Features/WelcomeMessage/Domain/Events/WelcomeMessageSentEvent';
import { DomainEvent } from '@shared/Domain/Events/DomainEvent';

describe('WelcomeMessage Integration', () => {
    let eventBus: InMemoryEventBus;
    let welcomeMessageService: WelcomeMessageService;
    let smsStrategy: SMSMessageStrategy;
    let emailStrategy: EmailMessageStrategy;
    let consoleStrategy: ConsoleMessageStrategy;

    beforeEach(() => {
        eventBus = new InMemoryEventBus();
        smsStrategy = new SMSMessageStrategy();
        emailStrategy = new EmailMessageStrategy();
        consoleStrategy = new ConsoleMessageStrategy();
        welcomeMessageService = new WelcomeMessageService(
            smsStrategy,
            emailStrategy,
            consoleStrategy,
            eventBus
        );

        // Suscribir el servicio al evento UserCreated
        eventBus.subscribe('UserCreatedEvent', async (event: DomainEvent) => {
            if (event instanceof UserCreatedEvent) {
                await welcomeMessageService.handleUserCreated(event);
            }
        });
    });

    it('should send welcome message via SMS when user prefers SMS', async () => {
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

    it('should send welcome message via email when user prefers email', async () => {
        const userId = UserId.create('123');
        const userName = UserName.create('Jane Doe');
        const communicationType = CommunicationType.create('EMAIL');
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

    it('should send welcome message via console when user prefers console', async () => {
        const userId = UserId.create('123');
        const userName = UserName.create('Bob Smith');
        const communicationType = CommunicationType.create('CONSOLE');
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

    it('should handle multiple user creation events', async () => {
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

        eventBus.subscribe('WelcomeMessageSentEvent', async (event: DomainEvent) => {
            if (event instanceof WelcomeMessageSentEvent) {
                welcomeMessageSentEvents.push(event);
            }
        });

        for (const event of events) {
            await eventBus.publish(event);
        }

        expect(welcomeMessageSentEvents).toHaveLength(3);
        expect(welcomeMessageSentEvents[0].userId.value).toBe('1');
        expect(welcomeMessageSentEvents[1].userId.value).toBe('2');
        expect(welcomeMessageSentEvents[2].userId.value).toBe('3');
    });
}); 