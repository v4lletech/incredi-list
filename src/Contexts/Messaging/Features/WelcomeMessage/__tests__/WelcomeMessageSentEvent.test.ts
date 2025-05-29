import { WelcomeMessageSentEvent } from '@messaging/Features/WelcomeMessage/Domain/Events/WelcomeMessageSentEvent';
import { UserId } from '@userManagement/Shared/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Shared/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Shared/Domain/ValueObjects/CommunicationType';

describe('WelcomeMessageSentEvent', () => {
    it('debería crear un evento de mensaje de bienvenida enviado', () => {
        // Arrange
        const userId = UserId.create('123');
        const userName = UserName.create('Juan Pérez');
        const communicationType = CommunicationType.create('EMAIL');
        const message = '¡Bienvenido Juan Pérez a nuestra plataforma!';

        // Act
        const event = new WelcomeMessageSentEvent(
            userId,
            userName,
            communicationType,
            message
        );

        // Assert
        expect(event.userId).toBe(userId);
        expect(event.userName).toBe(userName);
        expect(event.communicationType).toBe(communicationType);
        expect(event.message).toBe(message);
        expect(event.eventName).toBe('WelcomeMessageSentEvent');
        expect(event.occurredOn).toBeInstanceOf(Date);
    });

    it('debería registrar la fecha de ocurrencia del evento', () => {
        // Arrange
        const userId = UserId.create('123');
        const userName = UserName.create('Juan Pérez');
        const communicationType = CommunicationType.create('CONSOLE');
        const message = '¡Bienvenido Juan Pérez a nuestra plataforma!';

        // Act
        const event = new WelcomeMessageSentEvent(
            userId,
            userName,
            communicationType,
            message
        );

        // Assert
        expect(event.occurredOn).toBeInstanceOf(Date);
        expect(event.occurredOn.getTime()).toBeLessThanOrEqual(Date.now());
    });
}); 