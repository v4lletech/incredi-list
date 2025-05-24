export abstract class DomainEvent {
    private readonly _occurredOn: Date;

    constructor() {
        this._occurredOn = new Date();
    }

    get occurredOn(): Date {
        return this._occurredOn;
    }

    abstract eventName(): string;
} 