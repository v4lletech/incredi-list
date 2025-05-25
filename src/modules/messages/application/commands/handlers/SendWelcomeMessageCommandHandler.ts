import { SendWelcomeMessageCommand } from '@messages/application/commands/SendWelcomeMessageCommand';
import { MessageService } from '@messages/domain/services/MessageService';

export class SendWelcomeMessageCommandHandler {
  constructor(private readonly messageService: MessageService) {}

  async handle(command: SendWelcomeMessageCommand): Promise<void> {
    await this.messageService.sendMessage({
      channel: command.communicationType,
      content: `Welcome ${command.userName}!`,
      recipient: command.userId
    });
  }
} 