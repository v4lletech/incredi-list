import { MessageStrategy } from '@messages/domain/strategies/MessageStrategy';
import { MessageChannel } from '@messages/domain/value-objects/MessageChannel';

export class EmailMessageStrategy implements MessageStrategy {
  async send(message: string, recipient: string): Promise<void> {
    // TODO: Implementar lógica real de envío de email
    console.log(`[EMAIL] Sending to ${recipient}: ${message}`);
  }

  getChannel(): MessageChannel {
    return MessageChannel.EMAIL;
  }
} 