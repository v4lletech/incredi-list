import { UserCreatedEventHandler } from '@messaging/Features/WelcomeMessage/Application/EventHandlers/UserCreatedEventHandler';
import { MessageService } from '@messaging/Shared/Domain/Services/MessageService';
import { UserCreatedEvent } from '@userManagement/Features/UserCreation/Domain/Events/UserCreatedEvent';
import { UserId } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Features/UserCreation/Domain/ValueObjects/CommunicationType';

describe('UserCreatedEventHandler', () => {
    let messageService: jest.Mocked<MessageService>;
    let eventHandler: UserCreatedEventHandler;

    beforeEach(() => {
        messageService = {
            sendMessage: jest.fn()
        } as unknown as jest.Mocked<MessageService>;

        eventHandler = new UserCreatedEventHandler(messageService);
    });

    it('debería enviar un mensaje de bienvenida cuando se crea un usuario', async () => {
        // Arrange
        const userId = UserId.create('123');
        const userName = UserName.create('John Doe');
        const communicationType = CommunicationType.create('EMAIL');
        const event = new UserCreatedEvent(userId, userName, communicationType);

        // Act
        await eventHandler.handle(event);

        // Assert
        expect(messageService.sendMessage).toHaveBeenCalledWith(
            '123',
            'John Doe',
            '¡Bienvenido John Doe a nuestra plataforma!',
            'EMAIL'
        );
    });

    it('no debería hacer nada si el evento no es UserCreatedEvent', async () => {
        // Arrange
        const event = { type: 'OtherEvent' };

        // Act
        await eventHandler.handle(event as any);

        // Assert
        expect(messageService.sendMessage).not.toHaveBeenCalled();
    });
}); 