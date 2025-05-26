import { IEventBus } from './IEventBus';
import { DomainEvent } from '@shared/Domain/Common/DomainEvent';

export class InMemoryEventBus implements IEventBus {
    private handlers: Map<string, ((event: DomainEvent) => Promise<void>)[]> = new Map();

    async publish(events: DomainEvent[]): Promise<void> {
        await Promise.all(
            events.map(async event => {
                const eventName = event.constructor.name;
                const eventHandlers = this.handlers.get(eventName) || [];
                await Promise.all(eventHandlers.map(handler => handler(event)));
            })
        );
    }

    subscribe(eventName: string, handler: (event: DomainEvent) => Promise<void>): void {
        const handlers = this.handlers.get(eventName) || [];
        handlers.push(handler);
        this.handlers.set(eventName, handlers);
    }
} 