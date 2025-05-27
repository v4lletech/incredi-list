import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { WelcomeMessageService } from '@messaging/Features/WelcomeMessage/Application/Services/WelcomeMessageService';
import { SMSMessageStrategy } from '@messaging/Shared/Domain/Strategies/SMSMessageStrategy';
import { EmailMessageStrategy } from '@messaging/Shared/Domain/Strategies/EmailMessageStrategy';
import { ConsoleMessageStrategy } from '@messaging/Shared/Domain/Strategies/ConsoleMessageStrategy';
import { UserCreatedEvent } from '@userManagement/Features/UserCreation/Domain/Events/UserCreatedEvent';
import { DomainEvent } from '@shared/Domain/Events/DomainEvent';

export class WelcomeMessageContainer {
    private readonly welcomeMessageService: WelcomeMessageService;

    constructor(private readonly eventBus: IEventBus) {
        const smsStrategy = new SMSMessageStrategy();
        const emailStrategy = new EmailMessageStrategy();
        const consoleStrategy = new ConsoleMessageStrategy();

        this.welcomeMessageService = new WelcomeMessageService(
            smsStrategy,
            emailStrategy,
            consoleStrategy,
            eventBus
        );
    }

    initialize(): void {
        // Suscribir el servicio al evento UserCreated
        this.eventBus.subscribe('UserCreatedEvent', async (event: DomainEvent) => {
            if (event instanceof UserCreatedEvent) {
                await this.welcomeMessageService.handleUserCreated(event);
            }
        });
    }
} 