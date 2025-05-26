import { InMemoryUserRepository } from '../InMemoryUserRepository';
import { User } from '@userManagement/Shared/Domain/Repositories/IUserRepository';

describe('InMemoryUserRepository', () => {
    let repository: InMemoryUserRepository;

    beforeEach(() => {
        repository = new InMemoryUserRepository();
    });

    describe('create', () => {
        it('should create a new user', async () => {
            const user: User = {
                id: '123',
                name: 'John Doe',
                communicationType: 'EMAIL'
            };

            const createdUser = await repository.create(user);

            expect(createdUser).toEqual(user);
            expect(await repository.findById('123')).toEqual(user);
        });

        it('should throw error if user with same ID exists', async () => {
            const user: User = {
                id: '123',
                name: 'John Doe',
                communicationType: 'EMAIL'
            };

            await repository.create(user);

            await expect(repository.create(user)).rejects.toThrow('User with this ID already exists');
        });
    });

    describe('findById', () => {
        it('should return null if user not found', async () => {
            expect(await repository.findById('123')).toBeNull();
        });

        it('should return user if found', async () => {
            const user: User = {
                id: '123',
                name: 'John Doe',
                communicationType: 'EMAIL'
            };

            await repository.create(user);

            expect(await repository.findById('123')).toEqual(user);
        });
    });

    describe('findAll', () => {
        it('should return empty array if no users', async () => {
            expect(await repository.findAll()).toEqual([]);
        });

        it('should return all users', async () => {
            const user1: User = {
                id: '123',
                name: 'John Doe',
                communicationType: 'EMAIL'
            };

            const user2: User = {
                id: '456',
                name: 'Jane Doe',
                communicationType: 'SMS'
            };

            await repository.create(user1);
            await repository.create(user2);

            const users = await repository.findAll();
            expect(users).toHaveLength(2);
            expect(users).toContainEqual(user1);
            expect(users).toContainEqual(user2);
        });
    });

    describe('update', () => {
        it('should throw error if user not found', async () => {
            await expect(repository.update('123', { name: 'John Doe' }))
                .rejects.toThrow('User not found');
        });

        it('should update user', async () => {
            const user: User = {
                id: '123',
                name: 'John Doe',
                communicationType: 'EMAIL'
            };

            await repository.create(user);

            const updatedUser = await repository.update('123', { name: 'Jane Doe' });

            expect(updatedUser).toEqual({
                id: '123',
                name: 'Jane Doe',
                communicationType: 'EMAIL'
            });
        });
    });

    describe('delete', () => {
        it('should delete user', async () => {
            const user: User = {
                id: '123',
                name: 'John Doe',
                communicationType: 'EMAIL'
            };

            await repository.create(user);
            await repository.delete('123');

            expect(await repository.findById('123')).toBeNull();
        });
    });
}); 