import { CommandHandler } from '@shared/Infrastructure/CommandBus/CommandHandler';
import { CreateUserV2Command } from '@userManagement/Features/UserCreation/Application/Commands/CreateUserV2Command';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { UserId } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Features/UserCreation/Domain/ValueObjects/CommunicationType';
import { UserAggregate } from '@userManagement/Features/UserCreation/Domain/Aggregates/UserAggregate';

export class CreateUserV2CommandHandler implements CommandHandler<CreateUserV2Command> {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventBus: IEventBus
    ) {}

    async execute(command: CreateUserV2Command): Promise<void> {
        try {
            const userId = UserId.create(command.id);
            const userName = UserName.create(command.name);
            const communicationType = CommunicationType.create(command.communicationType);

            const userAggregate = UserAggregate.create(userId, userName, communicationType);
            await this.userRepository.create(userAggregate);
            await Promise.all(userAggregate.getUncommittedEvents().map(event => this.eventBus.publish(event)));
        } catch (error) {
            console.error('Error in CreateUserV2CommandHandler:', error);
            throw error;
        }
    }
} 