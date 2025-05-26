import { IMessageStrategy } from './IMessageStrategy';

export class SMSMessageStrategy implements IMessageStrategy {
    async sendMessage(userId: string, userName: string, message: string): Promise<void> {
        // Aquí iría la implementación real del envío de SMS
        console.log(`Enviando SMS a ${userName} (${userId}): ${message}`);
    }
} 