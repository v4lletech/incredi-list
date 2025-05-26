import { DomainEvent } from '@shared/Domain/Common/DomainEvent';
import { UserCreatedEvent } from '@userManagement/Features/UserCreation/Domain/Events/UserCreatedEvent';
import { MessageService } from '@messaging/Shared/Domain/Services/MessageService';

export class UserCreatedEventHandler {
    constructor(private readonly messageService: MessageService) {}

    async handle(event: DomainEvent): Promise<void> {
        if (!(event instanceof UserCreatedEvent)) {
            return;
        }

        const userId = event.userId.toString();
        const userName = event.name.toString();
        const communicationType = event.communicationType.toString();
        const welcomeMessage = `¡Bienvenido ${userName} a nuestra plataforma!`;

        await this.messageService.sendMessage(
            userId,
            userName,
            welcomeMessage,
            communicationType
        );
    }
} 