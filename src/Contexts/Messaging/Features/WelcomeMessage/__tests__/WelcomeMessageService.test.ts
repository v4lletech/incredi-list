import { WelcomeMessageService } from '@messaging/Features/WelcomeMessage/Application/Services/WelcomeMessageService';
import { IMessageStrategy } from '@messaging/Shared/Domain/Strategies/IMessageStrategy';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { UserCreatedEvent } from '@userManagement/Features/UserCreation/Domain/Events/UserCreatedEvent';
import { UserId } from '@userManagement/Shared/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Shared/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Shared/Domain/ValueObjects/CommunicationType';
import { WelcomeMessageSentEvent } from '@messaging/Features/WelcomeMessage/Domain/Events/WelcomeMessageSentEvent';
import { InvalidCommunicationTypeError } from '@userManagement/Shared/Domain/Errors/InvalidCommunicationTypeError';

describe('WelcomeMessageService', () => {
    let service: WelcomeMessageService;
    let smsStrategy: jest.Mocked<IMessageStrategy>;
    let emailStrategy: jest.Mocked<IMessageStrategy>;
    let consoleStrategy: jest.Mocked<IMessageStrategy>;
    let eventBus: jest.Mocked<IEventBus>;

    beforeEach(() => {
        smsStrategy = {
            sendMessage: jest.fn()
        } as jest.Mocked<IMessageStrategy>;

        emailStrategy = {
            sendMessage: jest.fn()
        } as jest.Mocked<IMessageStrategy>;

        consoleStrategy = {
            sendMessage: jest.fn()
        } as jest.Mocked<IMessageStrategy>;

        eventBus = {
            publish: jest.fn(),
            subscribe: jest.fn(),
            unsubscribe: jest.fn()
        } as jest.Mocked<IEventBus>;

        service = new WelcomeMessageService(
            smsStrategy,
            emailStrategy,
            consoleStrategy,
            eventBus
        );
    });

    describe('handleUserCreated', () => {
        it('debería enviar mensaje SMS y publicar evento cuando el tipo de comunicación es SMS', async () => {
            // Arrange
            const userId = UserId.create('123');
            const userName = UserName.create('Juan Pérez');
            const communicationType = CommunicationType.create('SMS');
            const event = new UserCreatedEvent(userId, userName, communicationType);

            // Act
            await service.handleUserCreated(event);

            // Assert
            expect(smsStrategy.sendMessage).toHaveBeenCalledWith(
                '123',
                'Juan Pérez',
                '¡Bienvenido Juan Pérez a nuestra plataforma!'
            );
            expect(eventBus.publish).toHaveBeenCalledWith(
                expect.any(WelcomeMessageSentEvent)
            );
        });

        it('debería enviar mensaje Email y publicar evento cuando el tipo de comunicación es EMAIL', async () => {
            // Arrange
            const userId = UserId.create('123');
            const userName = UserName.create('Juan Pérez');
            const communicationType = CommunicationType.create('EMAIL');
            const event = new UserCreatedEvent(userId, userName, communicationType);

            // Act
            await service.handleUserCreated(event);

            // Assert
            expect(emailStrategy.sendMessage).toHaveBeenCalledWith(
                '123',
                'Juan Pérez',
                '¡Bienvenido Juan Pérez a nuestra plataforma!'
            );
            expect(eventBus.publish).toHaveBeenCalledWith(
                expect.any(WelcomeMessageSentEvent)
            );
        });

        it('debería enviar mensaje por consola y publicar evento cuando el tipo de comunicación es CONSOLE', async () => {
            // Arrange
            const userId = UserId.create('123');
            const userName = UserName.create('Juan Pérez');
            const communicationType = CommunicationType.create('CONSOLE');
            const event = new UserCreatedEvent(userId, userName, communicationType);

            // Act
            await service.handleUserCreated(event);

            // Assert
            expect(consoleStrategy.sendMessage).toHaveBeenCalledWith(
                '123',
                'Juan Pérez',
                '¡Bienvenido Juan Pérez a nuestra plataforma!'
            );
            expect(eventBus.publish).toHaveBeenCalledWith(
                expect.any(WelcomeMessageSentEvent)
            );
        });

        it('debería lanzar error cuando el tipo de comunicación no es soportado', async () => {
            // Arrange
            const userId = UserId.create('123');
            const userName = UserName.create('Juan Pérez');
            const event = new UserCreatedEvent(
                userId,
                userName,
                { value: 'INVALID' } as CommunicationType
            );

            // Act & Assert
            await expect(service.handleUserCreated(event)).rejects.toThrow(
                'Tipo de comunicación no soportado: INVALID'
            );
            expect(eventBus.publish).not.toHaveBeenCalled();
        });

        it('debería manejar errores en el envío del mensaje', async () => {
            // Arrange
            const userId = UserId.create('123');
            const userName = UserName.create('Juan Pérez');
            const communicationType = CommunicationType.create('SMS');
            const event = new UserCreatedEvent(userId, userName, communicationType);
            const error = new Error('Error al enviar SMS');
            smsStrategy.sendMessage.mockRejectedValue(error);

            // Act & Assert
            await expect(service.handleUserCreated(event)).rejects.toThrow(error);
            expect(eventBus.publish).not.toHaveBeenCalled();
        });
    });
}); 