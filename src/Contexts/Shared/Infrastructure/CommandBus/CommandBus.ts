import { ICommandHandler } from '@shared/Infrastructure/CommandBus/ICommandHandler';

export class CommandBus {
    private handlers: Map<string, ICommandHandler<any>> = new Map();

    register(commandName: string, handler: ICommandHandler<any>): void {
        if (this.handlers.has(commandName)) {
            console.warn(`Handler already registered for command ${commandName}, overwriting...`);
        }
        this.handlers.set(commandName, handler);
        console.log(`Handler registered for command ${commandName}`);
    }

    async dispatch(command: any): Promise<void> {
        const commandName = command.constructor.name;
        console.log(`Dispatching command: ${commandName}`);
        
        const handler = this.handlers.get(commandName);
        
        if (!handler) {
            console.error(`No handler registered for command ${commandName}`);
            console.log('Available handlers:', Array.from(this.handlers.keys()));
            throw new Error(`No handler registered for command ${commandName}`);
        }

        try {
            await handler.execute(command);
        } catch (error) {
            console.error(`Error dispatching command ${commandName}:`, error);
            throw error;
        }
    }
} 