import { ICommandHandler } from '@shared/Infrastructure/CommandBus/ICommandHandler';
import { CreateUserV2Command } from '../Commands/CreateUserV2Command';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { UserAggregate } from '@userManagement/Features/UserCreation/Domain/Aggregates/UserAggregate';
import { UserId } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Features/UserCreation/Domain/ValueObjects/CommunicationType';
import { v4 as uuidv4 } from 'uuid';

export class CreateUserV2CommandHandler implements ICommandHandler<CreateUserV2Command> {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventBus: IEventBus
    ) {}

    async handle(command: CreateUserV2Command): Promise<void> {
        const userId = uuidv4();
        
        const user = UserAggregate.create(
            UserId.create(userId),
            UserName.create(command.name),
            CommunicationType.create(command.communicationType)
        );

        await this.userRepository.save(user);
        await this.eventBus.publish(user.getUncommittedEvents());
    }
} 