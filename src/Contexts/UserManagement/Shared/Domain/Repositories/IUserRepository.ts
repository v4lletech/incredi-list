import { UserAggregate } from '@userManagement/Features/UserCreation/Domain/Aggregates/UserAggregate';
import { UserId } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserId';

export interface IUserRepository {
    create(user: UserAggregate): Promise<UserAggregate>;
    findById(id: UserId): Promise<UserAggregate | null>;
    findAll(): Promise<UserAggregate[]>;
    update(id: UserId, user: UserAggregate): Promise<UserAggregate>;
    delete(id: UserId): Promise<void>;
} 