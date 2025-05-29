import { IMessageStrategy } from '@messaging/Shared/Domain/Strategies/IMessageStrategy';

export class ConsoleMessageStrategy implements IMessageStrategy {
    async sendMessage(userId: string, userName: string, message: string): Promise<void> {
        if (!message.trim()) {
            throw new Error('El mensaje no puede estar vacío');
        }
        console.log(`Enviando mensaje de bienvenida por consola a ${userName} (ID: ${userId}): ${message}`);
    }
} 