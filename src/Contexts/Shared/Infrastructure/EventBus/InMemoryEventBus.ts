import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { DomainEvent } from '@shared/Domain/Events/DomainEvent';

export class InMemoryEventBus implements IEventBus {
    private handlers: Map<string, ((event: DomainEvent) => Promise<void>)[]> = new Map();

    async publish(event: DomainEvent): Promise<void> {
        const eventName = event.constructor.name;
        const eventHandlers = this.handlers.get(eventName) || [];
        await Promise.all(eventHandlers.map(handler => handler(event)));
    }

    subscribe(eventName: string, handler: (event: DomainEvent) => Promise<void>): void {
        const handlers = this.handlers.get(eventName) || [];
        handlers.push(handler);
        this.handlers.set(eventName, handlers);
    }

    unsubscribe(eventName: string, handler: (event: DomainEvent) => Promise<void>): void {
        const handlers = this.handlers.get(eventName) || [];
        const index = handlers.indexOf(handler);
        if (index > -1) {
            handlers.splice(index, 1);
            this.handlers.set(eventName, handlers);
        }
    }
} 