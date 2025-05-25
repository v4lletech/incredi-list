import { MessageChannel } from '../value-objects/MessageChannel';

export interface MessageStrategy {
  send(message: string, recipient: string): Promise<void>;
  getChannel(): MessageChannel;
} 