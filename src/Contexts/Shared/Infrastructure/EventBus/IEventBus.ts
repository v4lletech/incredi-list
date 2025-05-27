import { DomainEvent } from '@shared/Domain/Events/DomainEvent';

export interface IEventBus {
    publish(event: DomainEvent): Promise<void>;
    subscribe(eventName: string, handler: (event: DomainEvent) => Promise<void>): void;
    unsubscribe(eventName: string, handler: (event: DomainEvent) => Promise<void>): void;
} 