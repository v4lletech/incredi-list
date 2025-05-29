import { UserAggregate } from '@userManagement/Shared/Domain/Aggregates/UserAggregate';
import { UserId } from '@userManagement/Shared/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Shared/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Shared/Domain/ValueObjects/CommunicationType';
import { UserCreatedEvent } from '@userManagement/Features/UserCreation/Domain/Events/UserCreatedEvent';

describe('UserAggregate', () => {
    describe('create', () => {
        it('debería crear un usuario exitosamente', () => {
            // Arrange
            const id = UserId.create('123');
            const name = UserName.create('Juan Pérez');
            const communicationType = CommunicationType.create('EMAIL');

            // Act
            const user = UserAggregate.create(id, name, communicationType);

            // Assert
            expect(user).toBeInstanceOf(UserAggregate);
            expect(user.id).toBe(id);
            expect(user.name).toBe(name);
            expect(user.communicationType).toBe(communicationType);
        });

        it('debería convertir a DTO correctamente', () => {
            // Arrange
            const id = UserId.create('123');
            const name = UserName.create('Juan Pérez');
            const communicationType = CommunicationType.create('EMAIL');
            const user = UserAggregate.create(id, name, communicationType);

            // Act
            const dto = user.toDTO();

            // Assert
            expect(dto).toEqual({
                id: '123',
                name: 'Juan Pérez',
                communicationType: 'EMAIL'
            });
        });

        it('debería crear desde DTO correctamente', () => {
            // Arrange
            const dto = {
                id: '123',
                name: 'Juan Pérez',
                communicationType: 'EMAIL'
            };

            // Act
            const user = UserAggregate.fromDTO(dto) as UserAggregate;

            // Assert
            expect(user).toBeInstanceOf(UserAggregate);
            expect(user.id.value).toBe('123');
            expect(user.name.value).toBe('Juan Pérez');
            expect(user.communicationType.value).toBe('EMAIL');
        });

        it('debería actualizar un usuario correctamente', () => {
            // Arrange
            const id = UserId.create('123');
            const name = UserName.create('Juan Pérez');
            const communicationType = CommunicationType.create('EMAIL');
            const user = UserAggregate.create(id, name, communicationType);
            const newName = UserName.create('Juan Pérez Actualizado');
            const newCommunicationType = CommunicationType.create('SMS');

            // Act
            const updatedUser = user.update(newName, newCommunicationType);

            // Assert
            expect(updatedUser).toBeInstanceOf(UserAggregate);
            expect(updatedUser.id).toBe(id);
            expect(updatedUser.name).toBe(newName);
            expect(updatedUser.communicationType).toBe(newCommunicationType);
        });

        it('debería mantener valores existentes al actualizar parcialmente', () => {
            // Arrange
            const id = UserId.create('123');
            const name = UserName.create('Juan Pérez');
            const communicationType = CommunicationType.create('EMAIL');
            const user = UserAggregate.create(id, name, communicationType);
            const newName = UserName.create('Juan Pérez Actualizado');

            // Act
            const updatedUser = user.update(newName);

            // Assert
            expect(updatedUser).toBeInstanceOf(UserAggregate);
            expect(updatedUser.id).toBe(id);
            expect(updatedUser.name).toBe(newName);
            expect(updatedUser.communicationType).toBe(communicationType);
        });
    });
}); 