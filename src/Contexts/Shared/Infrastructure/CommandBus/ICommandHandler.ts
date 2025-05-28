import { AggregateRoot } from '@shared/Domain/Aggregates/AggregateRoot';

export interface ICommandHandler<T> {
    execute(command: T): Promise<AggregateRoot>;
} 