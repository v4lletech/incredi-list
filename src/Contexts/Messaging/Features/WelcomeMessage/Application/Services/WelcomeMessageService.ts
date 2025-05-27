import { IMessageStrategy } from '@messaging/Shared/Domain/Strategies/IMessageStrategy';
import { UserCreatedEvent } from '@userManagement/Features/UserCreation/Domain/Events/UserCreatedEvent';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { WelcomeMessageSentEvent } from '@messaging/Features/WelcomeMessage/Domain/Events/WelcomeMessageSentEvent';
import { CommunicationType } from '@userManagement/Features/UserCreation/Domain/ValueObjects/CommunicationType';

export class WelcomeMessageService {
    constructor(
        private readonly smsStrategy: IMessageStrategy,
        private readonly emailStrategy: IMessageStrategy,
        private readonly consoleStrategy: IMessageStrategy,
        private readonly eventBus: IEventBus
    ) {}

    async handleUserCreated(event: UserCreatedEvent): Promise<void> {
        try {
            const strategy = this.getStrategyForCommunicationType(event.communicationType);
            await strategy.sendMessage(event.name);

            const welcomeMessage = `¡Bienvenido ${event.name.value} a nuestra plataforma!`;
            await this.eventBus.publish(
                new WelcomeMessageSentEvent(
                    event.id,
                    event.name,
                    event.communicationType,
                    welcomeMessage
                )
            );
        } catch (error) {
            console.error('Error al enviar mensaje de bienvenida:', error);
            throw error;
        }
    }

    private getStrategyForCommunicationType(communicationType: CommunicationType): IMessageStrategy {
        switch (communicationType.value) {
            case 'SMS':
                return this.smsStrategy;
            case 'EMAIL':
                return this.emailStrategy;
            case 'CONSOLE':
                return this.consoleStrategy;
            default:
                throw new Error(`Tipo de comunicación no soportado: ${communicationType.value}`);
        }
    }
} 