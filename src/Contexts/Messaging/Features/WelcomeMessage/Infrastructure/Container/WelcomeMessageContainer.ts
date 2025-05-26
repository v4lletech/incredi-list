import { UserCreatedEventHandler } from '@messaging/Features/WelcomeMessage/Application/EventHandlers/UserCreatedEventHandler';
import { MessageService } from '@messaging/Shared/Domain/Services/MessageService';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { UserCreatedEvent } from '@userManagement/Features/UserCreation/Domain/Events/UserCreatedEvent';

export class WelcomeMessageContainer {
    constructor(private readonly eventBus: IEventBus) {}

    initialize(): void {
        const messageService = new MessageService();
        const userCreatedEventHandler = new UserCreatedEventHandler(messageService);

        this.eventBus.subscribe('UserCreatedEvent', (event) => userCreatedEventHandler.handle(event));
    }
} 