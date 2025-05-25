import { MessageStrategy } from '../strategies/MessageStrategy';
import { MessageChannel } from '../value-objects/MessageChannel';

export class MessageService {
  private strategies: Map<MessageChannel, MessageStrategy>;

  constructor() {
    this.strategies = new Map();
  }

  registerStrategy(strategy: MessageStrategy): void {
    this.strategies.set(strategy.getChannel(), strategy);
  }

  async sendMessage(channel: MessageChannel, message: string, recipient: string): Promise<void> {
    const strategy = this.strategies.get(channel);
    if (!strategy) {
      throw new Error(`No strategy registered for channel: ${channel}`);
    }
    await strategy.send(message, recipient);
  }
} 