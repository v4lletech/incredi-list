import { DomainEvent } from '@shared/Domain/Events/DomainEvent';
import { UserId } from '@userManagement/Shared/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Shared/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Shared/Domain/ValueObjects/CommunicationType';

export class UserEditedEvent extends DomainEvent {
    constructor(
        public readonly id: UserId,
        public readonly name: UserName,
        public readonly communicationType: CommunicationType
    ) {
        super('UserEditedEvent');
    }
} 