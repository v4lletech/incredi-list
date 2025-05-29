import { WelcomeMessageContainer } from '../Infrastructure/Container/WelcomeMessageContainer';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { UserCreatedEvent } from '@userManagement/Features/UserCreation/Domain/Events/UserCreatedEvent';
import { UserId } from '@userManagement/Shared/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Shared/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Shared/Domain/ValueObjects/CommunicationType';
import { WelcomeMessageService } from '../Application/Services/WelcomeMessageService';

describe('WelcomeMessageContainer', () => {
    let eventBus: jest.Mocked<IEventBus>;
    let container: WelcomeMessageContainer;

    beforeEach(() => {
        eventBus = {
            publish: jest.fn(),
            subscribe: jest.fn(),
            unsubscribe: jest.fn()
        } as jest.Mocked<IEventBus>;
    });

    it('debería inicializar y suscribirse al evento UserCreatedEvent', () => {
        // Arrange
        container = new WelcomeMessageContainer(eventBus);

        // Act
        container.initialize();

        // Assert
        expect(eventBus.subscribe).toHaveBeenCalledWith(
            UserCreatedEvent.name,
            expect.any(Function)
        );
    });

    it('debería ejecutar handleUserCreated del servicio al recibir UserCreatedEvent', async () => {
        // Arrange
        container = new WelcomeMessageContainer(eventBus);
        container.initialize();
        const subscribeCall = eventBus.subscribe.mock.calls[0];
        const eventName = subscribeCall[0];
        const handler = subscribeCall[1];
        const userId = UserId.create('123');
        const userName = UserName.create('Juan Pérez');
        const communicationType = CommunicationType.create('EMAIL');
        const event = new UserCreatedEvent(userId, userName, communicationType);
        // Espía sobre el método handleUserCreated
        const service = (container as any).welcomeMessageService as WelcomeMessageService;
        const handleSpy = jest.spyOn(service, 'handleUserCreated').mockResolvedValue();

        // Act
        await handler(event);

        // Assert
        expect(handleSpy).toHaveBeenCalledWith(event);
    });

    it('debería manejar errores en handleUserCreated y loguear el error', async () => {
        // Arrange
        container = new WelcomeMessageContainer(eventBus);
        container.initialize();
        const subscribeCall = eventBus.subscribe.mock.calls[0];
        const handler = subscribeCall[1];
        const userId = UserId.create('123');
        const userName = UserName.create('Juan Pérez');
        const communicationType = CommunicationType.create('EMAIL');
        const event = new UserCreatedEvent(userId, userName, communicationType);
        const service = (container as any).welcomeMessageService as WelcomeMessageService;
        const error = new Error('Error simulado');
        jest.spyOn(service, 'handleUserCreated').mockRejectedValue(error);
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

        // Act
        await handler(event);

        // Assert
        expect(consoleSpy).toHaveBeenCalledWith('Error handling UserCreated event:', error);
        consoleSpy.mockRestore();
    });

    it('no debe llamar handleUserCreated si el evento no es instancia de UserCreatedEvent', async () => {
        // Arrange
        container = new WelcomeMessageContainer(eventBus);
        container.initialize();
        const subscribeCall = eventBus.subscribe.mock.calls[0];
        const handler = subscribeCall[1];
        // Crear un DomainEvent válido pero no UserCreatedEvent
        class FakeEvent {
            public readonly eventName = 'UserCreatedEvent';
            public readonly occurredOn = new Date();
        }
        const fakeEvent = new FakeEvent() as any;
        const service = (container as any).welcomeMessageService as WelcomeMessageService;
        const handleSpy = jest.spyOn(service, 'handleUserCreated');

        // Act
        await handler(fakeEvent);

        // Assert
        expect(handleSpy).not.toHaveBeenCalled();
    });
}); 