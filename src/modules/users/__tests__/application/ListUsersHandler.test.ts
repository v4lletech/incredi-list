import { ListUsersHandler } from '../../application/ListUsersHandler';
import { User } from '../../domain/User';
import { UserRepository } from '../../domain/UserRepository';

describe('ListUsersHandler', () => {
    let handler: ListUsersHandler;
    let mockRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        mockRepository = {
            save: jest.fn(),
            findAll: jest.fn()
        };
        handler = new ListUsersHandler(mockRepository);
    });

    it('should return all users from repository', async () => {
        const expectedUsers = [
            new User('123', 'John Doe', 'email'),
            new User('456', 'Jane Doe', 'phone')
        ];

        mockRepository.findAll.mockResolvedValue(expectedUsers);

        const result = await handler.handle();

        expect(result).toEqual(expectedUsers);
        expect(mockRepository.findAll).toHaveBeenCalled();
    });
}); 