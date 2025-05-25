import { InMemoryUserRepository } from '../../../infrastructure/repositories/InMemoryUserRepository';
import { User } from '../../../domain/User';

describe('InMemoryUserRepository', () => {
    let repository: InMemoryUserRepository;

    beforeEach(() => {
        repository = new InMemoryUserRepository();
    });

    it('should save and return a user', async () => {
        const user = new User('123', 'John Doe', 'email');
        const savedUser = await repository.save(user);

        expect(savedUser).toEqual(user);
    });

    it('should return all saved users', async () => {
        const user1 = new User('123', 'John Doe', 'email');
        const user2 = new User('456', 'Jane Doe', 'phone');

        await repository.save(user1);
        await repository.save(user2);

        const users = await repository.findAll();
        expect(users).toHaveLength(2);
        expect(users).toContainEqual(user1);
        expect(users).toContainEqual(user2);
    });
}); 