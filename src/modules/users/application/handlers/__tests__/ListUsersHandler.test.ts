import { ListUsersHandler } from '../ListUsersHandler';
import { CreateUserHandler } from '../CreateUserHandler';
import { InMemoryUserRepository } from '@users/infrastructure/repositories/InMemoryUserRepository';
import { CommunicationTypeValue } from '@users/domain/value-objects/CommunicationType';

describe('ListUsersHandler', () => {
    let listHandler: ListUsersHandler;
    let createHandler: CreateUserHandler;
    let repository: InMemoryUserRepository;

    beforeEach(() => {
        repository = new InMemoryUserRepository();
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
        await createHandler.handle('John Doe', 'EMAIL' as CommunicationTypeValue);
        await createHandler.handle('Jane Smith', 'SMS' as CommunicationTypeValue);

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
        expect(() => new ListUsersHandler(invalidRepository as any))
            .toThrow('Invalid repository instance');
    });
}); 