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

    it('should return paginated users', async () => {
        const users = [
            { id: '1', name: 'User 1', communicationType: 'EMAIL' },
            { id: '2', name: 'User 2', communicationType: 'SMS' }
        ];

        mockUserRepository.findAll.mockResolvedValue(users);

        const query = new ListUsersQuery(1, 10);
        const result = await handler.execute(query);

        expect(result.users).toHaveLength(2);
        expect(result.total).toBe(2);
        expect(result.page).toBe(1);
        expect(result.limit).toBe(10);
        expect(result.totalPages).toBe(1);
    });

    it('should handle empty results', async () => {
        mockUserRepository.findAll.mockResolvedValue([]);

        const query = new ListUsersQuery(1, 10);
        const result = await handler.execute(query);

        expect(result.users).toHaveLength(0);
        expect(result.total).toBe(0);
        expect(result.page).toBe(1);
        expect(result.limit).toBe(10);
        expect(result.totalPages).toBe(0);
    });

    it('should handle pagination correctly', async () => {
        const users = Array.from({ length: 25 }, (_, i) => ({
            id: `${i + 1}`,
            name: `User ${i + 1}`,
            communicationType: 'EMAIL'
        }));

        mockUserRepository.findAll.mockResolvedValue(users);

        const query = new ListUsersQuery(2, 10);
        const result = await handler.execute(query);

        expect(result.users).toHaveLength(10);
        expect(result.total).toBe(25);
        expect(result.page).toBe(2);
        expect(result.limit).toBe(10);
        expect(result.totalPages).toBe(3);
    });

    it('debería manejar errores del repositorio', async () => {
        // Arrange
        const error = new Error('Error de base de datos');
        mockUserRepository.findAll.mockRejectedValue(error);

        const query = new ListUsersQuery(1, 10);

        // Act & Assert
        await expect(handler.execute(query)).rejects.toThrow('Error de base de datos');
    });
}); 