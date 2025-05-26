import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { UserAggregate } from '@userManagement/Features/UserCreation/Domain/Aggregates/UserAggregate';
import { UserId } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserId';

export class InMemoryUserRepository implements IUserRepository {
    private users: Map<string, UserAggregate> = new Map();

    async save(user: UserAggregate): Promise<void> {
        this.users.set(user.id.toString(), user);
    }

    async findById(id: UserId): Promise<UserAggregate | null> {
        return this.users.get(id.toString()) || null;
    }

    async findAll(skip: number, limit: number): Promise<UserAggregate[]> {
        const users = Array.from(this.users.values());
        return users.slice(skip, skip + limit);
    }

    async count(): Promise<number> {
        return this.users.size;
    }
} 