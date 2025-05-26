import { IMessageStrategy } from './IMessageStrategy';

export class EmailMessageStrategy implements IMessageStrategy {
    async sendMessage(userId: string, userName: string, message: string): Promise<void> {
        // Aquí iría la implementación real del envío de email
        console.log(`Enviando email a ${userName} (${userId}): ${message}`);
    }
} 