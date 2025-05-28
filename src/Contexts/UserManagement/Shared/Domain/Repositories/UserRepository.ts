import { User } from '@userManagement/Shared/Domain/Entities/User';

export interface UserRepository {
    save(user: User): Promise<void>;
    findById(id: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    delete(id: string): Promise<void>;
    update(user: User): Promise<void>;
} 