import { DomainEvent } from '@shared/Domain/Events/DomainEvent';
import { UserId } from '@userManagement/Shared/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Shared/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Shared/Domain/ValueObjects/CommunicationType';

export class WelcomeMessageSentEvent extends DomainEvent {
    constructor(
        public readonly userId: UserId,
        public readonly userName: UserName,
        public readonly communicationType: CommunicationType,
        public readonly message: string
    ) {
        super('WelcomeMessageSentEvent');
    }
} 