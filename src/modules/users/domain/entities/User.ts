import { UserName } from '@users/domain/value-objects/UserName';
import { CommunicationType, CommunicationTypeValue } from '@users/domain/value-objects/CommunicationType';
import { UserCreatedEvent } from '@users/domain/events/UserCreatedEvent';
import { eventBus } from '@users/domain/events/EventBus';

export class User {
    private readonly _id: string;
    private readonly _name: UserName;
    private readonly _communicationType: CommunicationType;

    private constructor(id: string, name: UserName, communicationType: CommunicationType) {
        this._id = id;
        this._name = name;
        this._communicationType = communicationType;
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name.value;
    }

    get communicationType(): CommunicationTypeValue {
        return this._communicationType.value;
    }

    static async create(id: string, name: string, communicationType: CommunicationTypeValue): Promise<User> {
        const userName = UserName.create(name);
        const commType = CommunicationType.create(communicationType);
        const user = new User(id, userName, commType);

        const event = new UserCreatedEvent(user);
        await eventBus.publish(event);

        return user;
    }
} 