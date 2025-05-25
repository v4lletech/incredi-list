import { DomainEvent } from '@shared/domain/events/DomainEvent';
import { User } from '@users/domain/entities/User';
import { CommunicationType } from '@users/domain/value-objects/CommunicationType';

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
        return 'UserCreated';
    }

    get payload() {
        return {
            id: this._user.id,
            name: this._user.name,
            communicationType: this._user.communicationType as CommunicationType
        };
    }
} 