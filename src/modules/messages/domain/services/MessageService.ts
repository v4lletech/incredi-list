import { MessageStrategy } from '@messages/domain/strategies/MessageStrategy';
import { MessageChannel } from '@messages/domain/value-objects/MessageChannel';

export interface MessageParams {
  channel: MessageChannel;
  content: string;
  recipient: string;
}

export class MessageService {
  private strategies: Map<MessageChannel, MessageStrategy>;

  constructor() {
    this.strategies = new Map();
  }

  registerStrategy(strategy: MessageStrategy): void {
    this.strategies.set(strategy.getChannel(), strategy);
  }

  async sendMessage(params: MessageParams): Promise<void> {
    const strategy = this.strategies.get(params.channel);
    if (!strategy) {
      throw new Error(`No strategy registered for channel: ${params.channel}`);
    }
    await strategy.send(params.content, params.recipient);
  }
} 