import { IMessageStrategy } from './IMessageStrategy';

export class ConsoleMessageStrategy implements IMessageStrategy {
    async sendMessage(userId: string, userName: string, message: string): Promise<void> {
        console.log(`[CONSOLE] Mensaje para ${userName} (${userId}): ${message}`);
    }
} 