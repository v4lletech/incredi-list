import { ListUsersQueryHandler } from '@users/application/queries/handlers/ListUsersQueryHandler';
import { ListUsersQuery } from '@users/application/queries/ListUsersQuery';
import { User } from '@users/domain/entities/User';
import { UserRepository } from '@users/domain/repositories/UserRepository';
import { CommunicationType } from '@users/domain/value-objects/CommunicationType';

describe('ListUsersQueryHandler', () => {
    let handler: ListUsersQueryHandler;
    let mockRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        mockRepository = {
            save: jest.fn(),
            findAll: jest.fn()
        };
        handler = new ListUsersQueryHandler(mockRepository);
    });

    it('should return all users from repository', async () => {
        const expectedUsers = [
            new User('123', 'John Doe', CommunicationType.EMAIL),
            new User('456', 'Jane Doe', CommunicationType.SMS)
        ];

        mockRepository.findAll.mockResolvedValue(expectedUsers);

        const result = await handler.handle(new ListUsersQuery());

        expect(result).toEqual(expectedUsers);
        expect(mockRepository.findAll).toHaveBeenCalled();
    });
}); 