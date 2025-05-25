import { MessageStrategy } from '@messages/domain/strategies/MessageStrategy';
import { MessageChannel } from '@messages/domain/value-objects/MessageChannel';

export class SmsMessageStrategy implements MessageStrategy {
  getChannel(): MessageChannel {
    return MessageChannel.SMS;
  }

  async send(content: string, recipient: string): Promise<void> {
    console.log(`[SMS] Sending to ${recipient}: ${content}`);
  }
} 