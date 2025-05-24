import { User } from '@users/domain/entities/User';
import { UserRepository } from '@users/domain/repositories/UserRepository';

export class InMemoryUserRepository implements UserRepository {
    private users: Map<string, User>;

    constructor() {
        this.users = new Map();
    }

    async save(user: User): Promise<void> {
        this.users.set(user.id, user);
    }

    async findById(id: string): Promise<User | null> {
        return this.users.get(id) || null;
    }

    async findAll(): Promise<User[]> {
        return Array.from(this.users.values());
    }

    clear(): void {
        this.users.clear();
    }
} 