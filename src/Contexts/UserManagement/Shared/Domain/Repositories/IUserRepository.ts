import { UserAggregate } from '@userManagement/Features/UserCreation/Domain/Aggregates/UserAggregate';
import { UserId } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserId';

export interface User {
    id?: string;
    name: string;
    communicationType: string;
    preferences?: Record<string, any>;
}

export interface IUserRepository {
    create(user: Omit<User, 'id'>): Promise<User>;
    findById(id: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    update(id: string, user: Partial<User>): Promise<User>;
    delete(id: string): Promise<void>;
} 