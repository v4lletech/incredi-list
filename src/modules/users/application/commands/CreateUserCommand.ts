import { CommunicationType } from '@users/domain/value-objects/CommunicationType';

export class CreateUserCommand {
    constructor(
        public readonly name: string,
        public readonly communicationType: CommunicationType
    ) {
        this.validate();
    }

    private validate(): void {
        if (!this.name || typeof this.name !== 'string') {
            throw new Error('Name must be a non-empty string');
        }

        if (!this.communicationType || typeof this.communicationType !== 'string') {
            throw new Error('Communication type must be a non-empty string');
        }

        const validTypes: CommunicationType[] = [CommunicationType.EMAIL, CommunicationType.SMS, CommunicationType.CONSOLE];
        if (!validTypes.includes(this.communicationType)) {
            throw new Error('Communication type must be one of: ' + validTypes.join(', '));
        }
    }
} 