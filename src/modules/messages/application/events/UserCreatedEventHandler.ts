import { UserCreatedEvent } from '@users/domain/events/UserCreatedEvent';
import { SendWelcomeMessageCommandHandler } from '@messages/application/commands/handlers/SendWelcomeMessageCommandHandler';
import { MessageChannel } from '@messages/domain/value-objects/MessageChannel';
import { CommunicationType } from '@users/domain/value-objects/CommunicationType';

function mapCommunicationTypeToMessageChannel(type: CommunicationType): MessageChannel {
  switch (type) {
    case CommunicationType.EMAIL:
      return MessageChannel.EMAIL;
    case CommunicationType.SMS:
      return MessageChannel.SMS;
    case CommunicationType.CONSOLE:
      return MessageChannel.CONSOLE;
    default:
      throw new Error('Tipo de comunicación no soportado');
  }
}

export class UserCreatedEventHandler {
  constructor(private readonly sendWelcomeMessageHandler: SendWelcomeMessageCommandHandler) {}

  async handle(event: UserCreatedEvent): Promise<void> {
    await this.sendWelcomeMessageHandler.handle({
      userId: event.payload.id,
      userName: event.payload.name,
      communicationType: mapCommunicationTypeToMessageChannel(event.payload.communicationType as CommunicationType)
    });
  }
} 