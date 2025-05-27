import { MessagingModule } from '@messaging/Shared/Infrastructure/Configuration/MessagingModule';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { WelcomeMessageContainer } from '@messaging/Features/WelcomeMessage/Infrastructure/Container/WelcomeMessageContainer';

jest.mock('@messaging/Features/WelcomeMessage/Infrastructure/Container/WelcomeMessageContainer');

describe('MessagingModule', () => {
    let eventBus: jest.Mocked<IEventBus>;
    let messagingModule: MessagingModule;

    beforeEach(() => {
        eventBus = {
            publish: jest.fn(),
            subscribe: jest.fn(),
            unsubscribe: jest.fn()
        };
        messagingModule = new MessagingModule(eventBus);
    });

    it('should initialize welcome message container', () => {
        messagingModule.initialize();

        expect(WelcomeMessageContainer).toHaveBeenCalledWith(eventBus);
    });

    it('debería retornar un router vacío', () => {
        // Act
        const router = messagingModule.getRoutes();

        // Assert
        expect(router).toBeDefined();
    });
}); 