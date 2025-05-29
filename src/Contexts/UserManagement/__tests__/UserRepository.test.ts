import { InMemoryUserRepository } from '@userManagement/Shared/Infrastructure/Persistence/InMemoryUserRepository';
import { UserAggregate } from '@userManagement/Shared/Domain/Aggregates/UserAggregate';
import { UserId } from '@userManagement/Shared/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Shared/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Shared/Domain/ValueObjects/CommunicationType';

describe('InMemoryUserRepository', () => {
    let repository: InMemoryUserRepository;
    let user: UserAggregate;

    beforeEach(() => {
        repository = new InMemoryUserRepository();
        const id = UserId.create('123');
        const name = UserName.create('Juan Pérez');
        const communicationType = CommunicationType.create('EMAIL');
        user = UserAggregate.create(id, name, communicationType);
    });

    describe('create', () => {
        it('debería crear un usuario exitosamente', async () => {
            // Act
            const createdUser = await repository.create(user);

            // Assert
            expect(createdUser).toBe(user);
            const foundUser = await repository.findById(user.id);
            expect(foundUser).toBe(user);
        });

        it('debería lanzar error si el usuario ya existe', async () => {
            // Arrange
            await repository.create(user);

            // Act & Assert
            await expect(repository.create(user)).rejects.toThrow('User with this ID already exists');
        });
    });

    describe('findById', () => {
        it('debería encontrar un usuario por ID', async () => {
            // Arrange
            await repository.create(user);

            // Act
            const foundUser = await repository.findById(user.id);

            // Assert
            expect(foundUser).toBe(user);
        });

        it('debería retornar null si el usuario no existe', async () => {
            // Arrange
            const nonExistentId = UserId.create('999');

            // Act
            const foundUser = await repository.findById(nonExistentId);

            // Assert
            expect(foundUser).toBeNull();
        });
    });

    describe('findAll', () => {
        it('debería retornar todos los usuarios', async () => {
            // Arrange
            const user2 = UserAggregate.create(
                UserId.create('456'),
                UserName.create('María García'),
                CommunicationType.create('SMS')
            );
            await repository.create(user);
            await repository.create(user2);

            // Act
            const users = await repository.findAll();

            // Assert
            expect(users).toHaveLength(2);
            expect(users).toContain(user);
            expect(users).toContain(user2);
        });

        it('debería retornar array vacío si no hay usuarios', async () => {
            // Act
            const users = await repository.findAll();

            // Assert
            expect(users).toHaveLength(0);
        });
    });

    describe('update', () => {
        it('debería actualizar un usuario exitosamente', async () => {
            // Arrange
            await repository.create(user);
            const updatedName = UserName.create('Juan Pérez Actualizado');
            const updatedUser = user.update(updatedName);

            // Act
            const result = await repository.update(user.id, updatedUser);

            // Assert
            expect(result).toBe(updatedUser);
            const foundUser = await repository.findById(user.id);
            expect(foundUser).toBe(updatedUser);
        });

        it('debería lanzar error si el usuario no existe', async () => {
            // Arrange
            const nonExistentId = UserId.create('999');

            // Act & Assert
            await expect(repository.update(nonExistentId, user)).rejects.toThrow('User not found');
        });
    });

    describe('delete', () => {
        it('debería eliminar un usuario exitosamente', async () => {
            // Arrange
            await repository.create(user);

            // Act
            await repository.delete(user.id);

            // Assert
            const foundUser = await repository.findById(user.id);
            expect(foundUser).toBeNull();
        });

        it('debería no lanzar error al eliminar usuario inexistente', async () => {
            // Arrange
            const nonExistentId = UserId.create('999');

            // Act & Assert
            await expect(repository.delete(nonExistentId)).resolves.not.toThrow();
        });
    });

    describe('clear', () => {
        it('debería limpiar todos los usuarios', async () => {
            // Arrange
            await repository.create(user);

            // Act
            await repository.clear();

            // Assert
            const users = await repository.findAll();
            expect(users).toHaveLength(0);
        });
    });
}); 