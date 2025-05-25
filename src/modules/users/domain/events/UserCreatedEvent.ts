import { DomainEvent } from '@users/domain/events/DomainEvent';
import { User } from '@users/domain/entities/User';
import { MessageChannel } from '@messages/domain/value-objects/MessageChannel';

export class UserCreatedEvent extends DomainEvent {
    private readonly _user: User;

    constructor(user: User) {
        super();
        this._user = user;
    }

    get user(): User {
        return this._user;
    }

    get payload() {
        return {
            id: this._user.id,
            name: this._user.name,
            communicationType: this._user.communicationType as MessageChannel
        };
    }

    eventName(): string {
        return 'UserCreated';
    }
} 