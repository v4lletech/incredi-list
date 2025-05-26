import { UserAggregate } from '@userManagement/Features/UserCreation/Domain/Aggregates/UserAggregate';
import { UserId } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserId';

export interface IUserRepository {
    save(user: UserAggregate): Promise<void>;
    findById(id: UserId): Promise<UserAggregate | null>;
} 