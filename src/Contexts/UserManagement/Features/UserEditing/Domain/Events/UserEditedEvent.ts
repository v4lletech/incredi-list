import { DomainEvent } from '@shared/Domain/Events/DomainEvent';
import { UserId } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Features/UserCreation/Domain/ValueObjects/CommunicationType';

export class UserEditedEvent extends DomainEvent {
    constructor(
        public readonly id: UserId,
        public readonly name: UserName,
        public readonly communicationType: CommunicationType
    ) {
        super('UserEditedEvent');
    }
} 