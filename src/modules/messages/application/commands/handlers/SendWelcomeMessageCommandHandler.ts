import { SendWelcomeMessageCommand } from '../SendWelcomeMessageCommand';
import { MessageService } from '@messages/domain/services/MessageService';

export class SendWelcomeMessageCommandHandler {
  constructor(private readonly messageService: MessageService) {}

  async handle(command: SendWelcomeMessageCommand): Promise<void> {
    const message = `¡Bienvenido ${command.userName} a nuestra plataforma!`;
    await this.messageService.sendMessage(
      command.communicationType,
      message,
      command.userId
    );
  }
} 