import { IMessageStrategy } from '@messaging/Shared/Domain/Strategies/IMessageStrategy';
import { UserName } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserName';

export class EmailMessageStrategy implements IMessageStrategy {
    async sendMessage(userName: UserName): Promise<void> {
        // En una implementación real, aquí se integraría con un servicio de email
        console.log(`Enviando email de bienvenida a ${userName.value}`);
    }
} 