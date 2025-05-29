import { AggregateRoot } from '@shared/Domain/Aggregates/AggregateRoot';
import { ICommandHandler } from '@shared/Infrastructure/CommandBus/ICommandHandler';

export class CommandBus {
    private handlers: Map<string, ICommandHandler<any>> = new Map();

    register(commandName: string, handler: ICommandHandler<any>): void {
        if (this.handlers.has(commandName)) {
            console.warn(`Advertencia: Sobrescribiendo handler para comando ${commandName}`);
        }
        this.handlers.set(commandName, handler);
        console.log(`Handler registered for command ${commandName}`);
    }

    async dispatch(command: any): Promise<AggregateRoot> {
        const commandName = command.constructor.name;
        console.log(`Dispatching command: ${commandName}`);
        
        const handler = this.handlers.get(commandName);
        
        if (!handler) {
            console.error(`No hay handler registrado para el comando ${commandName}`);
            console.log('Available handlers:', Array.from(this.handlers.keys()));
            throw new Error(`No hay handler registrado para el comando ${commandName}`);
        }

        try {
            return await handler.execute(command);
        } catch (error) {
            console.error(`Error al despachar comando ${commandName}:`, error);
            throw error;
        }
    }
} 