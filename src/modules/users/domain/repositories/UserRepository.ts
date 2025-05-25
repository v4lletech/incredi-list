import { User } from '@users/domain/entities/User';

export interface UserRepository {
    save(user: User): Promise<User>;
    findAll(): Promise<User[]>;
} 