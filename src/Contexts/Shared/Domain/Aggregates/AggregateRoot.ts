import { DomainEvent } from '@shared/Domain/Events/DomainEvent';

export abstract class AggregateRoot {
    private _domainEvents: DomainEvent[] = [];

    protected addDomainEvent(domainEvent: DomainEvent): void {
        this._domainEvents.push(domainEvent);
    }

    public getUncommittedEvents(): DomainEvent[] {
        const events = [...this._domainEvents];
        this._domainEvents = [];
        return events;
    }

    public clearEvents(): void {
        this._domainEvents = [];
    }
} 