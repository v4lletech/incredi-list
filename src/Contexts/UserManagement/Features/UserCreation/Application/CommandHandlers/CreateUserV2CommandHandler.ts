import { ICommandHandler } from '@shared/Infrastructure/CommandBus/ICommandHandler';
import { CreateUserV2Command } from '@userManagement/Features/UserCreation/Application/Commands/CreateUserV2Command';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { UserId } from '@userManagement/Shared/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Shared/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Shared/Domain/ValueObjects/CommunicationType';
import { UserAggregate } from '@userManagement/Shared/Domain/Aggregates/UserAggregate';
import { UserCreatedEvent } from '@userManagement/Features/UserCreation/Domain/Events/UserCreatedEvent';

export class CreateUserV2CommandHandler implements ICommandHandler<CreateUserV2Command> {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventBus: IEventBus
    ) {}

    async execute(command: CreateUserV2Command): Promise<UserAggregate> {
        try {
            const userId = UserId.create(command.id);
            const userName = UserName.create(command.name);
            const communicationType = CommunicationType.create(command.communicationType);

            const userAggregate = UserAggregate.create(userId, userName, communicationType);
            const createdUser = await this.userRepository.create(userAggregate);

            const event = new UserCreatedEvent(
                createdUser.id,
                createdUser.name,
                createdUser.communicationType
            );

            await this.eventBus.publish(event);

            return createdUser;
        } catch (error) {
            console.error('Error in CreateUserV2CommandHandler:', error);
            throw error;
        }
    }
} 