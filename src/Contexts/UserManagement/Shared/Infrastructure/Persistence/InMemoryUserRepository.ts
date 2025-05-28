import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { UserAggregate } from '@userManagement/Shared/Domain/Aggregates/UserAggregate';
import { UserId } from '@userManagement/Shared/Domain/ValueObjects/UserId';

export class InMemoryUserRepository implements IUserRepository {
    private users: Map<string, UserAggregate> = new Map();

    async create(user: UserAggregate): Promise<UserAggregate> {
        if (this.users.has(user.id.value)) {
            throw new Error('User with this ID already exists');
        }
        this.users.set(user.id.value, user);
        return user;
    }

    async findById(id: UserId): Promise<UserAggregate | null> {
        return this.users.get(id.value) || null;
    }

    async findAll(): Promise<UserAggregate[]> {
        return Array.from(this.users.values());
    }

    async update(id: UserId, user: UserAggregate): Promise<UserAggregate> {
        if (!this.users.has(id.value)) {
            throw new Error('User not found');
        }
        this.users.set(id.value, user);
        return user;
    }

    async delete(id: UserId): Promise<void> {
        this.users.delete(id.value);
    }
} 