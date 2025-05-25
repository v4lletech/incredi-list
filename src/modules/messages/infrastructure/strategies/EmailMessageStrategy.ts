import { MessageStrategy } from '@messages/domain/strategies/MessageStrategy';
import { MessageChannel } from '@messages/domain/value-objects/MessageChannel';

export class EmailMessageStrategy implements MessageStrategy {
  getChannel(): MessageChannel {
    return MessageChannel.EMAIL;
  }

  async send(content: string, recipient: string): Promise<void> {
    console.log(`[EMAIL] Sending to ${recipient}: ${content}`);
  }
} 