import { MessageChannel } from '@messages/domain/value-objects/MessageChannel';

export interface SendWelcomeMessageCommand {
  userId: string;
  userName: string;
  communicationType: MessageChannel;
} 