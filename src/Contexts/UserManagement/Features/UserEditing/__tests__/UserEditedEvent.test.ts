import { UserEditedEvent } from '@userManagement/Features/UserEditing/Domain/Events/UserEditedEvent';
import { UserId } from '@userManagement/Shared/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Shared/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Shared/Domain/ValueObjects/CommunicationType';

describe('UserEditedEvent', () => {
    it('debería crear un evento de edición de usuario', () => {
        // Arrange
        const userId = UserId.create('123');
        const oldName = UserName.create('Juan Pérez');
        const newName = UserName.create('Juan Pérez Actualizado');
        const oldCommunicationType = CommunicationType.create('EMAIL');
        const newCommunicationType = CommunicationType.create('SMS');

        // Act
        const event = new UserEditedEvent(
            userId,
            oldName,
            newName,
            oldCommunicationType,
            newCommunicationType
        );

        // Assert
        expect(event.userId).toBe(userId);
        expect(event.oldName).toBe(oldName);
        expect(event.newName).toBe(newName);
        expect(event.oldCommunicationType).toBe(oldCommunicationType);
        expect(event.newCommunicationType).toBe(newCommunicationType);
        expect(event.occurredOn).toBeInstanceOf(Date);
    });

    it('debería crear un evento con solo cambios en el nombre', () => {
        // Arrange
        const userId = UserId.create('123');
        const oldName = UserName.create('Juan Pérez');
        const newName = UserName.create('Juan Pérez Actualizado');
        const communicationType = CommunicationType.create('EMAIL');

        // Act
        const event = new UserEditedEvent(
            userId,
            oldName,
            newName,
            communicationType,
            communicationType
        );

        // Assert
        expect(event.userId).toBe(userId);
        expect(event.oldName).toBe(oldName);
        expect(event.newName).toBe(newName);
        expect(event.oldCommunicationType).toBe(communicationType);
        expect(event.newCommunicationType).toBe(communicationType);
    });

    it('debería crear un evento con solo cambios en el tipo de comunicación', () => {
        // Arrange
        const userId = UserId.create('123');
        const name = UserName.create('Juan Pérez');
        const oldCommunicationType = CommunicationType.create('EMAIL');
        const newCommunicationType = CommunicationType.create('SMS');

        // Act
        const event = new UserEditedEvent(
            userId,
            name,
            name,
            oldCommunicationType,
            newCommunicationType
        );

        // Assert
        expect(event.userId).toBe(userId);
        expect(event.oldName).toBe(name);
        expect(event.newName).toBe(name);
        expect(event.oldCommunicationType).toBe(oldCommunicationType);
        expect(event.newCommunicationType).toBe(newCommunicationType);
    });

    it('debería tener un nombre de evento consistente', () => {
        // Arrange
        const userId = UserId.create('123');
        const name = UserName.create('Juan Pérez');
        const communicationType = CommunicationType.create('EMAIL');

        // Act
        const event = new UserEditedEvent(
            userId,
            name,
            name,
            communicationType,
            communicationType
        );

        // Assert
        expect(event.eventName).toBe('UserEditedEvent');
    });
}); 