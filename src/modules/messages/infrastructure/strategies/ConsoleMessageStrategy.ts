import { MessageStrategy } from '@messages/domain/strategies/MessageStrategy';
import { MessageChannel } from '@messages/domain/value-objects/MessageChannel';

export class ConsoleMessageStrategy implements MessageStrategy {
  async send(message: string, recipient: string): Promise<void> {
    console.log(`[CONSOLE] Message for ${recipient}: ${message}`);
  }

  getChannel(): MessageChannel {
    return MessageChannel.CONSOLE;
  }
} 