import { v4 as uuidv4 } from 'uuid';
import { eventBus } from '@shared/domain/events/EventBus';
import { UserCreatedEvent } from '@users/domain/events/UserCreatedEvent';
import { CommunicationType } from '@users/domain/value-objects/CommunicationType';

export class User {
    private readonly _id: string;
    private readonly _name: string;
    private readonly _communicationType: CommunicationType;

    constructor(id: string, name: string, communicationType: CommunicationType) {
        this._id = id;
        this._name = name;
        this._communicationType = communicationType;
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get communicationType(): CommunicationType {
        return this._communicationType;
    }

    static create(name: string, communicationType: CommunicationType): User {
        const user = new User(uuidv4(), name, communicationType);
        eventBus.publish(new UserCreatedEvent(user));
        return user;
    }
} 