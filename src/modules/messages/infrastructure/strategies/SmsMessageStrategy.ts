import { MessageStrategy } from '@messages/domain/strategies/MessageStrategy';
import { MessageChannel } from '@messages/domain/value-objects/MessageChannel';

export class SmsMessageStrategy implements MessageStrategy {
  async send(message: string, recipient: string): Promise<void> {
    // TODO: Implementar lógica real de envío de SMS
    console.log(`[SMS] Sending to ${recipient}: ${message}`);
  }

  getChannel(): MessageChannel {
    return MessageChannel.SMS;
  }
} 