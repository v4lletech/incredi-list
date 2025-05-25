import { MessageStrategy } from '@messages/domain/strategies/MessageStrategy';
import { MessageChannel } from '@messages/domain/value-objects/MessageChannel';

export class ConsoleMessageStrategy implements MessageStrategy {
  getChannel(): MessageChannel {
    return MessageChannel.CONSOLE;
  }

  async send(content: string, recipient: string): Promise<void> {
    console.log(`[CONSOLE] Message for ${recipient}: ${content}`);
  }
} 