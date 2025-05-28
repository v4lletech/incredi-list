import { WelcomeMessageService } from '@messaging/Features/WelcomeMessage/Application/Services/WelcomeMessageService';
import { IMessageStrategy } from '@messaging/Shared/Domain/Strategies/IMessageStrategy';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { UserCreatedEvent } from '@userManagement/Features/UserCreation/Domain/Events/UserCreatedEvent';
import { UserId } from '@userManagement/Shared/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Shared/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Shared/Domain/ValueObjects/CommunicationType';
import { WelcomeMessageSentEvent } from '@messaging/Features/WelcomeMessage/Domain/Events/WelcomeMessageSentEvent';
import { DomainEvent } from '@shared/Domain/Events/DomainEvent';
import { InvalidCommunicationTypeError } from '@userManagement/Shared/Domain/Errors/InvalidCommunicationTypeError';

describe('WelcomeMessage Unit', () => {
    let eventBus: jest.Mocked<IEventBus>;
    let welcomeMessageService: WelcomeMessageService;
    let smsStrategy: jest.Mocked<IMessageStrategy>;
    let emailStrategy: jest.Mocked<IMessageStrategy>;
    let consoleStrategy: jest.Mocked<IMessageStrategy>;

    beforeEach(() => {
        eventBus = {
            publish: jest.fn(),
            subscribe: jest.fn(),
            unsubscribe: jest.fn()
        };
        smsStrategy = {
            sendMessage: jest.fn()
        };
        emailStrategy = {
            sendMessage: jest.fn()
        };
        consoleStrategy = {
            sendMessage: jest.fn()
        };
        welcomeMessageService = new WelcomeMessageService(
            smsStrategy,
            emailStrategy,
            consoleStrategy,
            eventBus
        );
    });

    it('should send welcome message via SMS when user prefers SMS', async () => {
        const userId = UserId.create('123');
        const userName = UserName.create('John Doe');
        const communicationType = CommunicationType.create('SMS');
        const event = new UserCreatedEvent(userId, userName, communicationType);

        await welcomeMessageService.handleUserCreated(event);

        expect(smsStrategy.sendMessage).toHaveBeenCalledWith(
            userId.value,
            userName.value,
            expect.stringContaining('Bienvenido')
        );
        expect(eventBus.publish).toHaveBeenCalledWith(expect.any(WelcomeMessageSentEvent));
    });

    it('should send welcome message via email when user prefers email', async () => {
        const userId = UserId.create('123');
        const userName = UserName.create('Jane Doe');
        const communicationType = CommunicationType.create('EMAIL');
        const event = new UserCreatedEvent(userId, userName, communicationType);

        await welcomeMessageService.handleUserCreated(event);

        expect(emailStrategy.sendMessage).toHaveBeenCalledWith(
            userId.value,
            userName.value,
            expect.stringContaining('Bienvenido')
        );
        expect(eventBus.publish).toHaveBeenCalledWith(expect.any(WelcomeMessageSentEvent));
    });

    it('should send welcome message via console when user prefers console', async () => {
        const userId = UserId.create('123');
        const userName = UserName.create('Bob Smith');
        const communicationType = CommunicationType.create('CONSOLE');
        const event = new UserCreatedEvent(userId, userName, communicationType);

        await welcomeMessageService.handleUserCreated(event);

        expect(consoleStrategy.sendMessage).toHaveBeenCalledWith(
            userId.value,
            userName.value,
            expect.stringContaining('Bienvenido')
        );
        expect(eventBus.publish).toHaveBeenCalledWith(expect.any(WelcomeMessageSentEvent));
    });

    it('should throw error for unsupported communication type', async () => {
        const userId = UserId.create('123');
        const userName = UserName.create('John Doe');
        
        expect(() => CommunicationType.create('INVALID')).toThrow(InvalidCommunicationTypeError);
    });
}); 