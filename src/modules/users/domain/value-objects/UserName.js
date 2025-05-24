class UserName {
    constructor(name) {
        this.validate(name);
        this._value = name;
    }

    validate(name) {
        if (!name || typeof name !== 'string') {
            throw new Error('Name must be a non-empty string');
        }

        if (!/^[a-zA-Z\s]+$/.test(name)) {
            throw new Error('Name must contain only letters and spaces');
        }

        if (name.length < 4) {
            throw new Error('Name must have at least 4 characters');
        }

        if (name.length > 50) {
            throw new Error('Name must not exceed 50 characters');
        }
    }

    get value() {
        return this._value;
    }

    equals(other) {
        if (!(other instanceof UserName)) {
            return false;
        }
        return this._value === other._value;
    }

    static create(name) {
        return new UserName(name);
    }
}

module.exports = UserName; 