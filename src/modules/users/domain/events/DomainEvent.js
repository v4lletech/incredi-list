class DomainEvent {
    constructor(occurredOn = new Date()) {
        this._occurredOn = occurredOn;
    }

    get occurredOn() {
        return this._occurredOn;
    }
}

module.exports = DomainEvent; 