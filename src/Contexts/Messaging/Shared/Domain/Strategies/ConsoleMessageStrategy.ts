import { IMessageStrategy } from '@messaging/Shared/Domain/Strategies/IMessageStrategy';
import { UserName } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserName';

export class ConsoleMessageStrategy implements IMessageStrategy {
    async sendMessage(userName: UserName): Promise<void> {
        console.log(`Enviando mensaje de bienvenida por consola a ${userName.value}`);
    }
} 