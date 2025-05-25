import { UserName } from '@users/domain/value-objects/UserName';
import { CommunicationType, CommunicationTypeValue } from '@users/domain/value-objects/CommunicationType';
import { UserCreatedEvent } from '@users/domain/events/UserCreatedEvent';
import { eventBus } from '@users/domain/events/EventBus';

export class User {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly communicationType: string
    ) {}

    static async create(id: string, name: string, communicationType: CommunicationTypeValue): Promise<User> {
        const userName = UserName.create(name);
        const commType = CommunicationType.create(communicationType);
        const user = new User(id, userName.value, commType.value);

        const event = new UserCreatedEvent(user);
        await eventBus.publish(event);

        return user;
    }
} 