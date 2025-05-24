import { User } from '@users/domain/entities/User';

export interface UserRepository {
    save(user: User): Promise<void>;
    findById(id: string): Promise<User | null>;
    findAll(): Promise<User[]>;
} 