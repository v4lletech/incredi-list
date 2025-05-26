import { DomainEvent } from '@shared/Domain/Events/DomainEvent';
import { UserId } from '../ValueObjects/UserId';
import { UserName } from '../ValueObjects/UserName';
import { CommunicationType } from '../ValueObjects/CommunicationType';

export class UserCreatedEvent extends DomainEvent {
    constructor(
        public readonly id: UserId,
        public readonly name: UserName,
        public readonly communicationType: CommunicationType
    ) {
        super('UserCreatedEvent');
    }
} 