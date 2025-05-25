import { MessageChannel } from '@messages/domain/value-objects/MessageChannel';

export interface MessageStrategy {
  send(message: string, recipient: string): Promise<void>;
  getChannel(): MessageChannel;
} 