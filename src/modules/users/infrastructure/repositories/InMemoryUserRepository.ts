import { User } from '@users/domain/User';
import { UserRepository } from '@users/domain/UserRepository';

export class InMemoryUserRepository implements UserRepository {
    private users: User[] = [];

    async save(user: User): Promise<User> {
        this.users.push(user);
        return user;
    }

    async findAll(): Promise<User[]> {
        return [...this.users];
    }
} 