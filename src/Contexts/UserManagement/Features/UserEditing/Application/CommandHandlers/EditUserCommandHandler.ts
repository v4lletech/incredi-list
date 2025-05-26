import { CommandHandler } from '@shared/Domain/Common/CommandHandler';
import { EditUserCommand } from '../Commands/EditUserCommand';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { UserId } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Features/UserCreation/Domain/ValueObjects/CommunicationType';
import { InvalidUserIdError } from '@userManagement/Features/UserCreation/Domain/Errors/InvalidUserIdError';
import { InvalidUserNameError } from '@userManagement/Features/UserCreation/Domain/Errors/InvalidUserNameError';
import { InvalidCommunicationTypeError } from '@userManagement/Features/UserCreation/Domain/Errors/InvalidCommunicationTypeError';
import { UserNotFoundError } from '@userManagement/Features/UserEditing/Domain/Errors/UserNotFoundError';
import { InvalidInputError } from '@userManagement/Features/UserEditing/Domain/Errors/InvalidInputError';
import { UserAggregate } from '@userManagement/Features/UserCreation/Domain/Aggregates/UserAggregate';

export class EditUserCommandHandler implements CommandHandler<EditUserCommand> {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventBus: IEventBus
    ) {}

    async execute(command: EditUserCommand): Promise<void> {
        try {
            if (!command.id || !command.name || !command.communicationType) {
                throw new InvalidInputError('Todos los campos son requeridos');
            }

            const userId = UserId.create(command.id);
            const user = await this.userRepository.findById(userId.value);

            if (!user) {
                throw new UserNotFoundError('Usuario no encontrado');
            }

            const newName = UserName.create(command.name);
            const newCommunicationType = CommunicationType.create(command.communicationType);

            const userAggregate = UserAggregate.create(userId, newName, newCommunicationType);
            await this.userRepository.update(userId.value, {
                id: userId.value,
                name: newName.value,
                communicationType: newCommunicationType.value
            });

            await this.eventBus.publish(userAggregate.getUncommittedEvents());
        } catch (error) {
            if (error instanceof InvalidInputError || 
                error instanceof InvalidUserIdError || 
                error instanceof InvalidUserNameError || 
                error instanceof InvalidCommunicationTypeError ||
                error instanceof UserNotFoundError) {
                throw error;
            }
            throw new Error('Error al editar el usuario: ' + (error instanceof Error ? error.message : 'Error desconocido'));
        }
    }
} 