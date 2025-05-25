import { CreateUserHandler } from '../../application/CreateUserHandler';
import { User } from '../../domain/User';
import { UserRepository } from '../../domain/UserRepository';

describe('CreateUserHandler', () => {
    let handler: CreateUserHandler;
    let mockRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        mockRepository = {
            save: jest.fn(),
            findAll: jest.fn()
        };
        handler = new CreateUserHandler(mockRepository);
    });

    it('should create and save a user', async () => {
        const name = 'John Doe';
        const communicationType = 'email';
        const expectedUser = new User('123', name, communicationType);

        mockRepository.save.mockResolvedValue(expectedUser);

        const result = await handler.handle(name, communicationType);

        expect(result).toEqual(expectedUser);
        expect(mockRepository.save).toHaveBeenCalledWith(expect.objectContaining({
            name,
            communicationType
        }));
    });
}); 