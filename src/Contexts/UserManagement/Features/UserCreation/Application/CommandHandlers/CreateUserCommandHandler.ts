import { CommandHandler } from '@shared/Domain/Common/CommandHandler';
import { CreateUserCommand } from '@userManagement/Features/UserCreation/Application/Commands/CreateUserCommand';
import { IUserRepository } from '@userManagement/Features/UserCreation/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { UserAggregate } from '@userManagement/Features/UserCreation/Domain/Aggregates/UserAggregate';
import { UserId } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Features/UserCreation/Domain/ValueObjects/CommunicationType';
import { InvalidUserIdError } from '@userManagement/Features/UserCreation/Domain/Errors/InvalidUserIdError';
import { InvalidUserNameError } from '@userManagement/Features/UserCreation/Domain/Errors/InvalidUserNameError';
import { InvalidCommunicationTypeError } from '@userManagement/Features/UserCreation/Domain/Errors/InvalidCommunicationTypeError';

export class CreateUserCommandHandler implements CommandHandler<CreateUserCommand> {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventBus: IEventBus
    ) {}

    async execute(command: CreateUserCommand): Promise<void> {
        try {
            if (!command.id || !command.name || !command.communicationType) {
                throw new InvalidUserIdError('Todos los campos son requeridos');
            }

            const user = UserAggregate.create(
                UserId.create(command.id),
                UserName.create(command.name),
                CommunicationType.create(command.communicationType)
            );

            await this.userRepository.save(user);
            await this.eventBus.publish(user.getUncommittedEvents());
        } catch (error) {
            if (error instanceof InvalidUserIdError || 
                error instanceof InvalidUserNameError || 
                error instanceof InvalidCommunicationTypeError) {
                throw error;
            }
            throw new Error('Error al crear el usuario: ' + (error instanceof Error ? error.message : 'Error desconocido'));
        }
    }
} 