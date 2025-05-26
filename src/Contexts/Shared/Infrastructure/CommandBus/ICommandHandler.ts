export interface ICommandHandler<T> {
    execute(command: T): Promise<void>;
} 