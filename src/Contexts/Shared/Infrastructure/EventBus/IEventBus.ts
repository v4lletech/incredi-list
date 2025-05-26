import { DomainEvent } from '../../Domain/Common/DomainEvent';

export interface IEventBus {
    publish(events: DomainEvent[]): Promise<void>;
    subscribe(eventName: string, handler: (event: DomainEvent) => Promise<void>): void;
} 