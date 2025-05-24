const UserName = require('@users/domain/value-objects/UserName');
const CommunicationType = require('@users/domain/value-objects/CommunicationType');
const UserCreatedEvent = require('@users/domain/events/UserCreatedEvent');
const eventBus = require('@users/domain/events/EventBus');

class User {
    constructor(id, name, communicationType) {
        this._id = id;
        this._name = name instanceof UserName ? name : UserName.create(name);
        this._communicationType = communicationType instanceof CommunicationType 
            ? communicationType 
            : CommunicationType.create(communicationType);
    }

    get id() {
        return this._id;
    }

    get name() {
        return this._name.value;
    }

    get communicationType() {
        return this._communicationType.value;
    }

    static async create(id, name, communicationType) {
        const user = new User(id, name, communicationType);
        const event = new UserCreatedEvent(user);
        await eventBus.publish(event);
        return user;
    }
}

module.exports = User; 