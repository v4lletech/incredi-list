import { ICommandHandler } from '@shared/Infrastructure/CommandBus/ICommandHandler';
import { CreateUserV1Command } from '@userManagement/Features/UserCreation/Application/Commands/CreateUserV1Command';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { UserAggregate } from '@userManagement/Shared/Domain/Aggregates/UserAggregate';
import { UserId } from '@userManagement/Shared/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Shared/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Shared/Domain/ValueObjects/CommunicationType';
import { v4 as uuidv4 } from 'uuid';

export class CreateUserV1CommandHandler implements ICommandHandler<CreateUserV1Command> {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventBus: IEventBus
    ) {}

    async execute(command: CreateUserV1Command): Promise<void> {
        try {
            const userId = UserId.create(uuidv4());
            const userName = UserName.create(command.name);
            const communicationType = CommunicationType.create(command.communicationType);

            const userAggregate = UserAggregate.create(userId, userName, communicationType);
            await this.userRepository.create(userAggregate);
            await Promise.all(userAggregate.getUncommittedEvents().map(event => this.eventBus.publish(event)));
        } catch (error) {
            console.error('Error en CreateUserV1CommandHandler:', error);
            throw error;
        }
    }
} 