export type CommunicationTypeValue = 'EMAIL' | 'SMS' | 'CONSOLE';

export class CommunicationType {
    private readonly _value: CommunicationTypeValue;

    constructor(value: CommunicationTypeValue) {
        this.validate(value);
        this._value = value;
    }

    private validate(value: string): void {
        const validTypes: CommunicationTypeValue[] = ['EMAIL', 'SMS', 'CONSOLE'];
        if (!validTypes.includes(value as CommunicationTypeValue)) {
            throw new Error('Invalid communication type');
        }
    }

    get value(): CommunicationTypeValue {
        return this._value;
    }

    equals(other: CommunicationType): boolean {
        if (!(other instanceof CommunicationType)) {
            return false;
        }
        return this._value === other._value;
    }

    static create(value: CommunicationTypeValue): CommunicationType {
        return new CommunicationType(value);
    }
} 