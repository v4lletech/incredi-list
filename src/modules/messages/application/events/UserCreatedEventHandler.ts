import { UserCreatedEvent } from '@users/domain/events/UserCreatedEvent';
import { SendWelcomeMessageCommand } from '../commands/SendWelcomeMessageCommand';
import { SendWelcomeMessageCommandHandler } from '../commands/handlers/SendWelcomeMessageCommandHandler';

export class UserCreatedEventHandler {
  constructor(private readonly commandHandler: SendWelcomeMessageCommandHandler) {}

  async handle(event: UserCreatedEvent): Promise<void> {
    const command = new SendWelcomeMessageCommand(
      event.payload.id,
      event.payload.name,
      event.payload.communicationType
    );
    await this.commandHandler.handle(command);
  }
} 