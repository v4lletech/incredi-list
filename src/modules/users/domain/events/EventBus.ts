import { DomainEvent } from './DomainEvent';

type EventHandler = (event: DomainEvent) => Promise<void>;

export class EventBus {
    private static instance: EventBus;
    private handlers: Map<string, EventHandler[]>;

    private constructor() {
        this.handlers = new Map();
    }

    static getInstance(): EventBus {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
        }
        return EventBus.instance;
    }

    subscribe(eventName: string, handler: EventHandler): void {
        if (!this.handlers.has(eventName)) {
            this.handlers.set(eventName, []);
        }
        this.handlers.get(eventName)?.push(handler);
    }

    async publish(event: DomainEvent): Promise<void> {
        const eventName = event.eventName();
        const handlers = this.handlers.get(eventName) || [];
        
        await Promise.all(
            handlers.map(handler => handler(event))
        );
    }
}

export const eventBus = EventBus.getInstance(); 