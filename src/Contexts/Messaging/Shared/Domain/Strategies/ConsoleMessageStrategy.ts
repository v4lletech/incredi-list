import { IMessageStrategy } from '@messaging/Shared/Domain/Strategies/IMessageStrategy';

export class ConsoleMessageStrategy implements IMessageStrategy {
    async sendMessage(userId: string, userName: string, message: string): Promise<void> {
        console.log(`Enviando mensaje de bienvenida por consola a ${userName} (ID: ${userId}): ${message}`);
    }
} 