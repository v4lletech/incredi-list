import { MessageService } from '@messages/domain/services/MessageService';
import { SendWelcomeMessageCommandHandler } from '@messages/application/commands/handlers/SendWelcomeMessageCommandHandler';
import { UserCreatedEventHandler } from '@messages/application/events/UserCreatedEventHandler';
import { EmailMessageStrategy } from './strategies/EmailMessageStrategy';
import { SmsMessageStrategy } from './strategies/SmsMessageStrategy';
import { ConsoleMessageStrategy } from './strategies/ConsoleMessageStrategy';
import { EventBus } from '@users/domain/events/EventBus';
import { DomainEvent } from '@users/domain/events/DomainEvent';

export function configureMessageModule(eventBus: EventBus): void {
  // Configurar estrategias
  const messageService = new MessageService();
  messageService.registerStrategy(new EmailMessageStrategy());
  messageService.registerStrategy(new SmsMessageStrategy());
  messageService.registerStrategy(new ConsoleMessageStrategy());

  // Configurar handlers
  const sendWelcomeMessageHandler = new SendWelcomeMessageCommandHandler(messageService);
  const userCreatedEventHandler = new UserCreatedEventHandler(sendWelcomeMessageHandler);

  // Suscribir al evento de usuario creado
  eventBus.subscribe('UserCreated', ((event: DomainEvent) => userCreatedEventHandler.handle(event as any)));
} 