import { BaseModule } from '@shared/Infrastructure/Configuration/BaseModule';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { WelcomeMessageContainer } from '@messaging/Features/WelcomeMessage/Infrastructure/Container/WelcomeMessageContainer';

export class MessagingModule extends BaseModule {
    constructor(private readonly eventBus: IEventBus) {
        super();
    }

    initialize(): void {
        const welcomeMessageContainer = new WelcomeMessageContainer(this.eventBus);
        welcomeMessageContainer.initialize();
    }
} 