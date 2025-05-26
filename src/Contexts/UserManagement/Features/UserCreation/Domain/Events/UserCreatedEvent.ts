import { DomainEvent } from '@shared/Domain/Common/DomainEvent';
import { UserId } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Features/UserCreation/Domain/ValueObjects/CommunicationType';

export class UserCreatedEvent extends DomainEvent {
    constructor(
        public readonly userId: UserId,
        public readonly name: UserName,
        public readonly communicationType: CommunicationType
    ) {
        super();
    }
} 