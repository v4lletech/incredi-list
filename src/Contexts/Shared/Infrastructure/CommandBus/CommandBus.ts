import { CommandHandler } from '@shared/Domain/Common/CommandHandler';

export class CommandBus {
    private handlers: Map<string, CommandHandler<any>> = new Map();

    register<T>(commandName: string, handler: CommandHandler<T>): void {
        this.handlers.set(commandName, handler);
    }

    async dispatch<T>(command: T): Promise<void> {
        const commandName = command.constructor.name;
        const handler = this.handlers.get(commandName);

        if (!handler) {
            throw new Error(`No handler registered for command ${commandName}`);
        }

        await handler.execute(command);
    }
} 