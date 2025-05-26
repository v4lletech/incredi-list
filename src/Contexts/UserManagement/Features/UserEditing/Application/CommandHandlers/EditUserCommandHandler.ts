import { CommandHandler } from '@shared/Domain/Common/CommandHandler';
import { EditUserCommand } from '../Commands/EditUserCommand';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { UserNotFoundError } from '../../Domain/Errors/UserNotFoundError';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { UserId } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Features/UserCreation/Domain/ValueObjects/CommunicationType';
import { InvalidUserIdError } from '@userManagement/Features/UserCreation/Domain/Errors/InvalidUserIdError';
import { InvalidUserNameError } from '@userManagement/Features/UserCreation/Domain/Errors/InvalidUserNameError';
import { InvalidCommunicationTypeError } from '@userManagement/Features/UserCreation/Domain/Errors/InvalidCommunicationTypeError';
import { InvalidInputError } from '@userManagement/Features/UserEditing/Domain/Errors/InvalidInputError';
import { UserAggregate } from '@userManagement/Features/UserCreation/Domain/Aggregates/UserAggregate';
import { UserEditedEvent } from '../../Domain/Events/UserEditedEvent';

export class EditUserCommandHandler implements CommandHandler<EditUserCommand> {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventBus: IEventBus
    ) {}

    async execute(command: EditUserCommand): Promise<void> {
        try {
            if (!command.id) {
                throw new InvalidInputError('El ID es requerido');
            }

            const userId = UserId.create(command.id);
            const user = await this.userRepository.findById(userId);

            if (!user) {
                throw new UserNotFoundError(command.id);
            }

            const updatedUser = user.update(
                command.name && command.name.trim() !== '' ? UserName.create(command.name) : undefined,
                command.communicationType && command.communicationType.trim() !== '' ? CommunicationType.create(command.communicationType) : undefined
            );

            await this.userRepository.update(userId, updatedUser);
            
            const event = new UserEditedEvent(
                updatedUser.id,
                updatedUser.name,
                updatedUser.communicationType
            );
            
            await this.eventBus.publish([event]);
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