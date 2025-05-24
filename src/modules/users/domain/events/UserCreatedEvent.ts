import { DomainEvent } from '@users/domain/events/DomainEvent';
import { User } from '@users/domain/entities/User';

export class UserCreatedEvent extends DomainEvent {
    private readonly _user: User;

    constructor(user: User) {
        super();
        this._user = user;
    }

    get user(): User {
        return this._user;
    }

    eventName(): string {
        return 'user.created';
    }
} 