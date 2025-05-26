import { ListUsersQueryHandler } from '../Application/QueryHandlers/ListUsersQueryHandler';
import { ListUsersQuery } from '../Application/Queries/ListUsersQuery';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { UserAggregate } from '@userManagement/Features/UserCreation/Domain/Aggregates/UserAggregate';
import { UserId } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Features/UserCreation/Domain/ValueObjects/CommunicationType';

describe('ListUsersQueryHandler', () => {
    let handler: ListUsersQueryHandler;
    let mockUserRepository: jest.Mocked<IUserRepository>;

    beforeEach(() => {
        mockUserRepository = {
            create: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        };

        handler = new ListUsersQueryHandler(mockUserRepository);
    });

    it('debería listar usuarios con paginación', async () => {
        // Arrange
        const users = [
            UserAggregate.create(
                UserId.create('1'),
                UserName.create('John Doe'),
                CommunicationType.create('EMAIL')
            ),
            UserAggregate.create(
                UserId.create('2'),
                UserName.create('Jane Smith'),
                CommunicationType.create('SMS')
            ),
            UserAggregate.create(
                UserId.create('3'),
                UserName.create('Bob Wilson'),
                CommunicationType.create('CONSOLE')
            )
        ];

        mockUserRepository.findAll.mockResolvedValue(users);

        // Act
        const query = new ListUsersQuery(1, 2);
        const result = await handler.execute(query);

        // Assert
        expect(result.users).toHaveLength(2);
        expect(result.total).toBe(3);
        expect(result.page).toBe(1);
        expect(result.limit).toBe(2);
        expect(result.totalPages).toBe(2);
        expect(result.users[0].id).toBe('1');
        expect(result.users[0].name).toBe('John Doe');
        expect(result.users[0].communicationType).toBe('EMAIL');
    });

    it('debería manejar lista vacía de usuarios', async () => {
        // Arrange
        mockUserRepository.findAll.mockResolvedValue([]);

        // Act
        const query = new ListUsersQuery(1, 10);
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
        const error = new Error('Error al obtener usuarios');
        mockUserRepository.findAll.mockRejectedValue(error);

        // Act & Assert
        const query = new ListUsersQuery(1, 10);
        await expect(handler.execute(query)).rejects.toThrow('Error al obtener usuarios');
    });

    it('debería aplicar paginación correctamente', async () => {
        // Arrange
        const users = Array.from({ length: 15 }, (_, i) => 
            UserAggregate.create(
                UserId.create(`${i + 1}`),
                UserName.create(`User ${i + 1}`),
                CommunicationType.create('EMAIL')
            )
        );

        mockUserRepository.findAll.mockResolvedValue(users);

        // Act
        const query = new ListUsersQuery(2, 5);
        const result = await handler.execute(query);

        // Assert
        expect(result.users).toHaveLength(5);
        expect(result.total).toBe(15);
        expect(result.page).toBe(2);
        expect(result.limit).toBe(5);
        expect(result.totalPages).toBe(3);
        expect(result.users[0].id).toBe('6');
    });
}); 