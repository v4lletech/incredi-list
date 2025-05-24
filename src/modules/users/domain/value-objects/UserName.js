class UserName {
    constructor(name) {
        this.validate(name);
        this._value = name;
    }

    validate(name) {
        if (!name || typeof name !== 'string') {
            throw new Error('Name must be a non-empty string');
        }

        if (name.length > 3) {
            throw new Error('Name must not have more than 3 letters');
        }

        if (!/^[a-zA-Z]+$/.test(name)) {
            throw new Error('Name must contain only letters');
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