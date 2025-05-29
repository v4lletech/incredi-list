import { IMessageStrategy } from '@messaging/Shared/Domain/Strategies/IMessageStrategy';

export class SMSMessageStrategy implements IMessageStrategy {
    async sendMessage(userId: string, userName: string, message: string): Promise<void> {
        if (!message.trim()) {
            throw new Error('El mensaje no puede estar vacío');
        }
        // En una implementación real, aquí se integraría con un servicio de SMS
        console.log(`Enviando SMS de bienvenida a ${userName} (ID: ${userId}): ${message}`);
    }
} 