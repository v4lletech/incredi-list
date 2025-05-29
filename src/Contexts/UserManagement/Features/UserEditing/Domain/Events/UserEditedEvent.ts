import { DomainEvent } from '@shared/Domain/Events/DomainEvent';
import { UserId } from '@userManagement/Shared/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Shared/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Shared/Domain/ValueObjects/CommunicationType';

export class UserEditedEvent extends DomainEvent {
    constructor(
        public readonly userId: UserId,
        public readonly oldName: UserName,
        public readonly newName: UserName,
        public readonly oldCommunicationType: CommunicationType,
        public readonly newCommunicationType: CommunicationType
    ) {
        super('UserEditedEvent');
    }
} 