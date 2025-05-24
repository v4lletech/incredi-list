const DomainEvent = require('./DomainEvent');

class UserCreatedEvent extends DomainEvent {
    constructor(user) {
        super();
        this._user = user;
    }

    get user() {
        return this._user;
    }
}

module.exports = UserCreatedEvent; 