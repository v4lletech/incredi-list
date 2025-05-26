import { ValueObject } from '@shared/Domain/Common/ValueObject';
import { InvalidCommunicationTypeError } from '@userManagement/Features/UserCreation/Domain/Errors/InvalidCommunicationTypeError';

export class CommunicationType extends ValueObject<string> {
    private constructor(value: string) {
        super(value);
    }

    public static create(value: string): CommunicationType {
        const validTypes = ['SMS', 'EMAIL', 'CONSOLE'];
        if (!validTypes.includes(value)) {
            throw new InvalidCommunicationTypeError('El tipo de comunicación debe ser SMS, EMAIL o CONSOLE');
        }
        return new CommunicationType(value);
    }

    public toString(): string {
        return this.value;
    }
} 