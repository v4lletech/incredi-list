import { ICommandHandler } from '@shared/Infrastructure/CommandBus/ICommandHandler';
import { CreateUserV2Command } from '../Commands/CreateUserV2Command';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { UserAggregate } from '@userManagement/Features/UserCreation/Domain/Aggregates/UserAggregate';
import { UserId } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Features/UserCreation/Domain/ValueObjects/CommunicationType';
import { v4 as uuidv4 } from 'uuid';
import { UserCreatedEvent } from '@userManagement/Features/UserCreation/Domain/Events/UserCreatedEvent';

export class CreateUserV2CommandHandler implements ICommandHandler<CreateUserV2Command> {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventBus: IEventBus
    ) {}

    async handle(command: CreateUserV2Command): Promise<void> {
        const userId = uuidv4();
        
        const user = await this.userRepository.create({
            name: command.name,
            communicationType: command.communicationType,
            preferences: command.preferences
        });

        if (!user.id || !user.name || !user.communicationType) {
            throw new Error('Usuario creado con datos incompletos');
        }

        const event = new UserCreatedEvent(
            UserId.create(user.id),
            UserName.create(user.name),
            CommunicationType.create(user.communicationType)
        );
        await this.eventBus.publish([event]);
    }
} 