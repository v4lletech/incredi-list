const ListUsersHandler = require('@users/application/handlers/ListUsersHandler');
const CreateUserHandler = require('@users/application/handlers/CreateUserHandler');
const MockUserRepository = require('@users/infrastructure/repositories/__mocks__/InMemoryUserRepository');

describe('ListUsersHandler', () => {
    let listHandler;
    let createHandler;
    let repository;

    beforeEach(() => {
        repository = new MockUserRepository();
        listHandler = new ListUsersHandler(repository);
        createHandler = new CreateUserHandler(repository);
    });

    afterEach(() => {
        repository.clear();
    });

    it('should return empty array when no users exist', async () => {
        // Act
        const users = await listHandler.handle();

        // Assert
        expect(users).toEqual([]);
    });

    it('should return all users successfully', async () => {
        // Arrange
        await createHandler.handle('John Doe', 'EMAIL');
        await createHandler.handle('Jane Smith', 'SMS');

        // Act
        const users = await listHandler.handle();

        // Assert
        expect(users).toHaveLength(2);
        expect(users[0].name).toBe('John Doe');
        expect(users[0].communicationType).toBe('EMAIL');
        expect(users[1].name).toBe('Jane Smith');
        expect(users[1].communicationType).toBe('SMS');
    });

    it('should throw error when repository is invalid', () => {
        // Arrange
        const invalidRepository = {};

        // Act & Assert
        expect(() => new ListUsersHandler(invalidRepository))
            .toThrow('Invalid repository instance');
    });
}); 