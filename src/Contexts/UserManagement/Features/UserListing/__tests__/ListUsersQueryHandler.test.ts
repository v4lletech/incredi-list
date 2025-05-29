import { ListUsersQueryHandler } from '@userManagement/Features/UserListing/Application/QueryHandlers/ListUsersQueryHandler';
import { ListUsersQuery } from '@userManagement/Features/UserListing/Application/Queries/ListUsersQuery';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { UserAggregate } from '@userManagement/Shared/Domain/Aggregates/UserAggregate';
import { UserId } from '@userManagement/Shared/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Shared/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Shared/Domain/ValueObjects/CommunicationType';

describe('ListUsersQueryHandler', () => {
    let handler: ListUsersQueryHandler;
    let userRepository: jest.Mocked<IUserRepository>;
    let mockUsers: UserAggregate[];

    beforeEach(() => {
        // Configurar el repositorio mock
        userRepository = {
            findAll: jest.fn(),
            create: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        };

        // Crear usuarios de prueba
        mockUsers = [
            UserAggregate.create(
                UserId.create('1'),
                UserName.create('Usuario 1'),
                CommunicationType.create('EMAIL')
            ),
            UserAggregate.create(
                UserId.create('2'),
                UserName.create('Usuario 2'),
                CommunicationType.create('SMS')
            ),
            UserAggregate.create(
                UserId.create('3'),
                UserName.create('Usuario 3'),
                CommunicationType.create('CONSOLE')
            )
        ];

        handler = new ListUsersQueryHandler(userRepository);
    });

    it('debería listar usuarios con paginación por defecto', async () => {
        // Arrange
        const query = new ListUsersQuery();
        userRepository.findAll.mockResolvedValue(mockUsers);

        // Act
        const result = await handler.execute(query);

        // Assert
        expect(result.users).toHaveLength(3);
        expect(result.total).toBe(3);
        expect(result.page).toBe(1);
        expect(result.limit).toBe(10);
        expect(result.totalPages).toBe(1);
        expect(userRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('debería paginar correctamente los resultados', async () => {
        // Arrange
        const query = new ListUsersQuery(1, 2);
        userRepository.findAll.mockResolvedValue(mockUsers);

        // Act
        const result = await handler.execute(query);

        // Assert
        expect(result.users).toHaveLength(2);
        expect(result.total).toBe(3);
        expect(result.page).toBe(1);
        expect(result.limit).toBe(2);
        expect(result.totalPages).toBe(2);
    });

    it('debería manejar página vacía', async () => {
        // Arrange
        const query = new ListUsersQuery(2, 2);
        userRepository.findAll.mockResolvedValue(mockUsers);

        // Act
        const result = await handler.execute(query);

        // Assert
        expect(result.users).toHaveLength(1);
        expect(result.total).toBe(3);
        expect(result.page).toBe(2);
        expect(result.limit).toBe(2);
        expect(result.totalPages).toBe(2);
    });

    it('debería manejar lista vacía de usuarios', async () => {
        // Arrange
        const query = new ListUsersQuery();
        userRepository.findAll.mockResolvedValue([]);

        // Act
        const result = await handler.execute(query);

        // Assert
        expect(result.users).toHaveLength(0);
        expect(result.total).toBe(0);
        expect(result.page).toBe(1);
        expect(result.limit).toBe(10);
        expect(result.totalPages).toBe(0);
    });

    it('debería manejar errores del repositorio', async () => {
        // Arrange
        const query = new ListUsersQuery();
        userRepository.findAll.mockRejectedValue(new Error('Error del repositorio'));

        // Act & Assert
        await expect(handler.execute(query)).rejects.toThrow('Error del repositorio');
    });
}); 