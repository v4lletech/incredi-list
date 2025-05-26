import { ICommandHandler } from '@shared/Infrastructure/CommandBus/ICommandHandler';
import { CreateUserV1Command } from '../Commands/CreateUserV1Command';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { UserAggregate } from '@userManagement/Features/UserCreation/Domain/Aggregates/UserAggregate';
import { UserId } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Features/UserCreation/Domain/ValueObjects/CommunicationType';
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
            await this.eventBus.publish(userAggregate.getUncommittedEvents());
        } catch (error) {
            console.error('Error en CreateUserV1CommandHandler:', error);
            throw error;
        }
    }
} 