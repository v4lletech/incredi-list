export interface CommandHandler<T> {
    execute(command: T): Promise<void>;
} 