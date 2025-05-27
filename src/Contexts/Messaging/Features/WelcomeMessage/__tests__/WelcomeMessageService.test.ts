import { WelcomeMessageService } from '../Application/Services/WelcomeMessageService';
import { IMessageStrategy } from '@messaging/Shared/Domain/Strategies/IMessageStrategy';
import { UserCreatedEvent } from '@userManagement/Features/UserCreation/Domain/Events/UserCreatedEvent';
import { UserId } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Features/UserCreation/Domain/ValueObjects/CommunicationType';

describe('WelcomeMessageService', () => {
    let welcomeMessageService: WelcomeMessageService;
    let mockSMSStrategy: jest.Mocked<IMessageStrategy>;
    let mockEmailStrategy: jest.Mocked<IMessageStrategy>;
    let mockConsoleStrategy: jest.Mocked<IMessageStrategy>;
    let mockEventBus: jest.Mocked<any>;

    beforeEach(() => {
        mockSMSStrategy = {
            sendMessage: jest.fn()
        };

        mockEmailStrategy = {
            sendMessage: jest.fn()
        };

        mockConsoleStrategy = {
            sendMessage: jest.fn()
        };

        mockEventBus = {
            publish: jest.fn()
        };

        welcomeMessageService = new WelcomeMessageService(
            mockSMSStrategy,
            mockEmailStrategy,
            mockConsoleStrategy,
            mockEventBus
        );
    });

    it('debería enviar mensaje por SMS cuando el tipo de comunicación es SMS', async () => {
        // Arrange
        const userId = UserId.create('123');
        const userName = UserName.create('John Doe');
        const communicationType = CommunicationType.create('SMS');
        const event = new UserCreatedEvent(userId, userName, communicationType);

        // Act
        await welcomeMessageService.handleUserCreated(event);

        // Assert
        expect(mockSMSStrategy.sendMessage).toHaveBeenCalledWith(
            '123',
            'John Doe',
            expect.stringContaining('Bienvenido John Doe')
        );
        expect(mockEmailStrategy.sendMessage).not.toHaveBeenCalled();
        expect(mockConsoleStrategy.sendMessage).not.toHaveBeenCalled();
    });

    it('debería enviar mensaje por Email cuando el tipo de comunicación es EMAIL', async () => {
        // Arrange
        const userId = UserId.create('123');
        const userName = UserName.create('John Doe');
        const communicationType = CommunicationType.create('EMAIL');
        const event = new UserCreatedEvent(userId, userName, communicationType);

        // Act
        await welcomeMessageService.handleUserCreated(event);

        // Assert
        expect(mockEmailStrategy.sendMessage).toHaveBeenCalledWith(
            '123',
            'John Doe',
            expect.stringContaining('Bienvenido John Doe')
        );
        expect(mockSMSStrategy.sendMessage).not.toHaveBeenCalled();
        expect(mockConsoleStrategy.sendMessage).not.toHaveBeenCalled();
    });

    it('debería enviar mensaje por Console cuando el tipo de comunicación es CONSOLE', async () => {
        // Arrange
        const userId = UserId.create('123');
        const userName = UserName.create('John Doe');
        const communicationType = CommunicationType.create('CONSOLE');
        const event = new UserCreatedEvent(userId, userName, communicationType);

        // Act
        await welcomeMessageService.handleUserCreated(event);

        // Assert
        expect(mockConsoleStrategy.sendMessage).toHaveBeenCalledWith(
            '123',
            'John Doe',
            expect.stringContaining('Bienvenido John Doe')
        );
        expect(mockSMSStrategy.sendMessage).not.toHaveBeenCalled();
        expect(mockEmailStrategy.sendMessage).not.toHaveBeenCalled();
    });

    it('debería manejar errores al enviar mensajes', async () => {
        // Arrange
        const userId = UserId.create('123');
        const userName = UserName.create('John Doe');
        const communicationType = CommunicationType.create('SMS');
        const event = new UserCreatedEvent(userId, userName, communicationType);
        
        const error = new Error('Error al enviar SMS');
        mockSMSStrategy.sendMessage.mockRejectedValue(error);

        // Act & Assert
        await expect(welcomeMessageService.handleUserCreated(event)).rejects.toThrow('Error al enviar SMS');
    });
}); 