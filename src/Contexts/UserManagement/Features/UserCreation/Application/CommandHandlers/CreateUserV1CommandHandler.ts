import { ICommandHandler } from '@shared/Infrastructure/CommandBus/ICommandHandler';
import { CreateUserV1Command } from '@userManagement/Features/UserCreation/Application/Commands/CreateUserV1Command';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { UserAggregate } from '@userManagement/Shared/Domain/Aggregates/UserAggregate';
import { UserId } from '@userManagement/Shared/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Shared/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Shared/Domain/ValueObjects/CommunicationType';
import { UserCreatedEvent } from '@userManagement/Features/UserCreation/Domain/Events/UserCreatedEvent';
import { v4 as uuidv4 } from 'uuid';

export class CreateUserV1CommandHandler implements ICommandHandler<CreateUserV1Command> {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventBus: IEventBus
    ) {}

    async execute(command: CreateUserV1Command): Promise<UserAggregate> {
        const userId = UserId.create(uuidv4());
        const userName = UserName.create(command.name);
        const communicationType = CommunicationType.create(command.communicationType);

        const user = UserAggregate.create(userId, userName, communicationType);
        const createdUser = await this.userRepository.create(user);

        const event = new UserCreatedEvent(
            createdUser.id,
            createdUser.name,
            createdUser.communicationType
        );

        await this.eventBus.publish(event);

        return createdUser;
    }
} 