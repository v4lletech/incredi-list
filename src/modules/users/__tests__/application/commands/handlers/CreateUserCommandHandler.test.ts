import { CreateUserCommandHandler } from '@users/application/commands/handlers/CreateUserCommandHandler';
import { CreateUserCommand } from '@users/application/commands/CreateUserCommand';
import { User } from '@users/domain/entities/User';
import { UserRepository } from '@users/domain/repositories/UserRepository';
import { CommunicationType } from '@users/domain/value-objects/CommunicationType';

describe('CreateUserCommandHandler', () => {
    let handler: CreateUserCommandHandler;
    let mockRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        mockRepository = {
            save: jest.fn(),
            findAll: jest.fn()
        };
        handler = new CreateUserCommandHandler(mockRepository);
    });

    it('should create and save a user', async () => {
        const name = 'John Doe';
        const communicationType = CommunicationType.EMAIL;
        const expectedUser = new User('123', name, communicationType);
        const command = new CreateUserCommand(name, communicationType);

        mockRepository.save.mockResolvedValue(expectedUser);

        const result = await handler.handle(command);

        expect(result).toEqual(expectedUser);
        expect(mockRepository.save).toHaveBeenCalledWith(expect.objectContaining({
            name,
            communicationType
        }));
    });
}); 