export interface ICommandHandler<T> {
    handle(command: T): Promise<void>;
} 