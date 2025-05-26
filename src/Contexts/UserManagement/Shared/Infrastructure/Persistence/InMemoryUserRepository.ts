import { IUserRepository, User } from '@userManagement/Shared/Domain/Repositories/IUserRepository';

export class InMemoryUserRepository implements IUserRepository {
    private users: Map<string, User> = new Map();

    async create(user: User): Promise<User> {
        if (this.users.has(user.id)) {
            throw new Error('User with this ID already exists');
        }
        this.users.set(user.id, user);
        return user;
    }

    async findById(id: string): Promise<User | null> {
        return this.users.get(id) || null;
    }

    async findAll(): Promise<User[]> {
        return Array.from(this.users.values());
    }

    async update(id: string, userData: Partial<User>): Promise<User> {
        const existingUser = await this.findById(id);
        if (!existingUser) {
            throw new Error('User not found');
        }
        const updatedUser = { ...existingUser, ...userData };
        this.users.set(id, updatedUser);
        return updatedUser;
    }

    async delete(id: string): Promise<void> {
        this.users.delete(id);
    }
} 