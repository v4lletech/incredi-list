import { MessageChannel } from '@messages/domain/value-objects/MessageChannel';

export class SendWelcomeMessageCommand {
  constructor(
    public readonly userId: string,
    public readonly userName: string,
    public readonly communicationType: MessageChannel
  ) {}
} 