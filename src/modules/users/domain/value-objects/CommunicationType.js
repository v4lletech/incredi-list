class CommunicationType {
    static CONSOLE = 'CONSOLE';
    static EMAIL = 'EMAIL';
    static SMS = 'SMS';

    constructor(type) {
        this.validate(type);
        this._value = type;
    }

    validate(type) {
        if (!type || typeof type !== 'string') {
            throw new Error('Communication type must be a non-empty string');
        }

        if (![CommunicationType.CONSOLE, CommunicationType.EMAIL, CommunicationType.SMS].includes(type)) {
            throw new Error('Invalid communication type. Must be either CONSOLE, EMAIL or SMS');
        }
    }

    get value() {
        return this._value;
    }

    equals(other) {
        if (!(other instanceof CommunicationType)) {
            return false;
        }
        return this._value === other._value;
    }

    static create(type) {
        return new CommunicationType(type);
    }
}

module.exports = CommunicationType; 