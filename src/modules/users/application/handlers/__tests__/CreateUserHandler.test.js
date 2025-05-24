const CreateUserHandler = require('@users/application/handlers/CreateUserHandler');
const MockUserRepository = require('@users/infrastructure/repositories/__mocks__/InMemoryUserRepository');
const User = require('@users/domain/entities/User');

describe('CreateUserHandler', () => {
    let handler;
    let repository;

    beforeEach(() => {
        repository = new MockUserRepository();
        handler = new CreateUserHandler(repository);
    });

    afterEach(() => {
        repository.clear();
    });

    it('should create a new user successfully', async () => {
        // Arrange
        const name = 'John Doe';
        const communicationType = 'EMAIL';

        // Act
        const user = await handler.handle(name, communicationType);

        // Assert
        expect(user).toBeInstanceOf(User);
        expect(user.name).toBe(name);
        expect(user.communicationType).toBe(communicationType);
        expect(user.id).toBeDefined();

        // Verify repository state
        const savedUser = await repository.findById(user.id);
        expect(savedUser).toBeDefined();
        expect(savedUser.name).toBe(name);
        expect(savedUser.communicationType).toBe(communicationType);
    });

    it('should throw error when repository is invalid', () => {
        // Arrange
        const invalidRepository = {};

        // Act & Assert
        expect(() => new CreateUserHandler(invalidRepository))
            .toThrow('Invalid repository instance');
    });

    it('should create multiple users successfully', async () => {
        // Arrange
        const users = [
            { name: 'John Doe', communicationType: 'EMAIL' },
            { name: 'Jane Smith', communicationType: 'SMS' }
        ];

        // Act
        const createdUsers = await Promise.all(
            users.map(user => handler.handle(user.name, user.communicationType))
        );

        // Assert
        expect(createdUsers).toHaveLength(2);
        createdUsers.forEach((user, index) => {
            expect(user.name).toBe(users[index].name);
            expect(user.communicationType).toBe(users[index].communicationType);
        });

        // Verify repository state
        const allUsers = await repository.findAll();
        expect(allUsers).toHaveLength(2);
    });

    it('should reject names shorter than 4 characters', async () => {
        // Arrange
        const invalidNames = ['A', 'AB', 'ABC', 'Tom'];
        
        // Act & Assert
        for (const name of invalidNames) {
            await expect(handler.handle(name, 'EMAIL'))
                .rejects
                .toThrow('Name must have at least 4 characters');
        }

        // Verify no users were created
        const allUsers = await repository.findAll();
        expect(allUsers).toHaveLength(0);
    });

    it('should reject names longer than 50 characters', async () => {
        // Arrange
        const longName = 'A'.repeat(51);
        
        // Act & Assert
        await expect(handler.handle(longName, 'EMAIL'))
            .rejects
            .toThrow('Name must not exceed 50 characters');

        // Verify no users were created
        const allUsers = await repository.findAll();
        expect(allUsers).toHaveLength(0);
    });

    it('should reject names with non-alphabetic characters', async () => {
        // Arrange
        const invalidNames = ['John123', 'Mary!', '123', 'A-B'];
        
        // Act & Assert
        for (const name of invalidNames) {
            await expect(handler.handle(name, 'EMAIL'))
                .rejects
                .toThrow('Name must contain only letters and spaces');
        }

        // Verify no users were created
        const allUsers = await repository.findAll();
        expect(allUsers).toHaveLength(0);
    });
}); 