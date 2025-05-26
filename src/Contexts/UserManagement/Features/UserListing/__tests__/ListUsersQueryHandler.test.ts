import { ListUsersQueryHandler } from '@userManagement/Features/UserListing/Application/QueryHandlers/ListUsersQueryHandler';
import { ListUsersQuery } from '@userManagement/Features/UserListing/Application/Queries/ListUsersQuery';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { UserAggregate } from '@userManagement/Features/UserCreation/Domain/Aggregates/UserAggregate';
import { UserId } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Features/UserCreation/Domain/ValueObjects/CommunicationType';

describe('ListUsersQueryHandler', () => {
    let mockUserRepository: jest.Mocked<IUserRepository>;
    let queryHandler: ListUsersQueryHandler;

    beforeEach(() => {
        mockUserRepository = {
            save: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            count: jest.fn()
        };

        queryHandler = new ListUsersQueryHandler(mockUserRepository);
    });

    it('debería retornar una lista paginada de usuarios', async () => {
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
            )
        ];

        mockUserRepository.findAll.mockResolvedValue(users);
        mockUserRepository.count.mockResolvedValue(2);

        const query = new ListUsersQuery(1, 10);

        // Act
        const result = await queryHandler.execute(query);

        // Assert
        expect(mockUserRepository.findAll).toHaveBeenCalledWith(0, 10);
        expect(mockUserRepository.count).toHaveBeenCalled();
        expect(result.users).toHaveLength(2);
        expect(result.total).toBe(2);
        expect(result.page).toBe(1);
        expect(result.limit).toBe(10);
        expect(result.totalPages).toBe(1);

        // Verificar el contenido de los DTOs
        expect(result.users[0]).toEqual({
            id: '1',
            name: 'John Doe',
            communicationType: 'EMAIL'
        });
        expect(result.users[1]).toEqual({
            id: '2',
            name: 'Jane Smith',
            communicationType: 'SMS'
        });
    });

    it('debería manejar páginas vacías', async () => {
        // Arrange
        mockUserRepository.findAll.mockResolvedValue([]);
        mockUserRepository.count.mockResolvedValue(0);

        const query = new ListUsersQuery(1, 10);

        // Act
        const result = await queryHandler.execute(query);

        // Assert
        expect(result.users).toHaveLength(0);
        expect(result.total).toBe(0);
        expect(result.totalPages).toBe(0);
    });

    it('debería calcular correctamente la paginación', async () => {
        // Arrange
        mockUserRepository.findAll.mockResolvedValue([]);
        mockUserRepository.count.mockResolvedValue(25);

        const query = new ListUsersQuery(2, 10);

        // Act
        const result = await queryHandler.execute(query);

        // Assert
        expect(mockUserRepository.findAll).toHaveBeenCalledWith(10, 10);
        expect(result.totalPages).toBe(3);
        expect(result.page).toBe(2);
    });

    it('debería manejar errores del repositorio', async () => {
        // Arrange
        const error = new Error('Error de base de datos');
        mockUserRepository.findAll.mockRejectedValue(error);

        const query = new ListUsersQuery(1, 10);

        // Act & Assert
        await expect(queryHandler.execute(query)).rejects.toThrow('Error de base de datos');
    });
}); 