import { ICommandHandler } from './ICommandHandler';

export class CommandBus {
    private handlers: Map<string, ICommandHandler<any>> = new Map();

    register(commandName: string, handler: ICommandHandler<any>): void {
        this.handlers.set(commandName, handler);
    }

    async dispatch(command: any): Promise<void> {
        const handler = this.handlers.get(command.constructor.name);
        if (!handler) {
            throw new Error(`No handler registered for command ${command.constructor.name}`);
        }
        await handler.handle(command);
    }
} 