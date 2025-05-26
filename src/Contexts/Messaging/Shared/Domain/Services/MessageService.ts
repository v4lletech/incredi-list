import { IMessageStrategy } from '../Strategies/IMessageStrategy';
import { EmailMessageStrategy } from '../Strategies/EmailMessageStrategy';
import { SMSMessageStrategy } from '../Strategies/SMSMessageStrategy';
import { ConsoleMessageStrategy } from '../Strategies/ConsoleMessageStrategy';

export class MessageService {
    private strategies: Map<string, IMessageStrategy>;

    constructor() {
        this.strategies = new Map();
        this.strategies.set('EMAIL', new EmailMessageStrategy());
        this.strategies.set('SMS', new SMSMessageStrategy());
        this.strategies.set('CONSOLE', new ConsoleMessageStrategy());
    }

    async sendMessage(userId: string, userName: string, message: string, communicationType: string): Promise<void> {
        const strategy = this.strategies.get(communicationType);
        if (!strategy) {
            throw new Error(`Tipo de comunicación no soportado: ${communicationType}`);
        }

        await strategy.sendMessage(userId, userName, message);
    }
} 