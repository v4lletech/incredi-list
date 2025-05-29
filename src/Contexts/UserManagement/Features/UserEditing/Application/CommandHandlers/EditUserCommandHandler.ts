import { ICommandHandler } from '@shared/Infrastructure/CommandBus/ICommandHandler';
import { EditUserCommand } from '@userManagement/Features/UserEditing/Application/Commands/EditUserCommand';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { UserNotFoundError } from '@userManagement/Features/UserEditing/Domain/Errors/UserNotFoundError';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { InvalidUserIdError } from '@userManagement/Shared/Domain/Errors/InvalidUserIdError';
import { InvalidUserNameError } from '@userManagement/Shared/Domain/Errors/InvalidUserNameError';
import { InvalidCommunicationTypeError } from '@userManagement/Shared/Domain/Errors/InvalidCommunicationTypeError';
import { InvalidInputError } from '@userManagement/Features/UserEditing/Domain/Errors/InvalidInputError';
import { UserEditedEvent } from '../../Domain/Events/UserEditedEvent';
import { UserAggregate } from '@userManagement/Shared/Domain/Aggregates/UserAggregate';
import { UserId } from '@userManagement/Shared/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Shared/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Shared/Domain/ValueObjects/CommunicationType';

export class EditUserCommandHandler implements ICommandHandler<EditUserCommand> {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventBus: IEventBus
    ) {}

    async execute(command: EditUserCommand): Promise<UserAggregate> {
        try {
            if (!command.id) {
                throw new InvalidInputError('El ID es requerido');
            }
            
            const userId = UserId.create(command.id);
            const user = await this.userRepository.findById(userId);

            if (!user) {
                throw new UserNotFoundError(userId.value);
            }

            let updatedName: UserName | undefined;
            let updatedCommunicationType: CommunicationType | undefined;

            try {
                if (command.name) {
                    updatedName = UserName.create(command.name);
                }
                if (command.communicationType) {
                    updatedCommunicationType = CommunicationType.create(command.communicationType);
                }
            } catch (error) {
                if (error instanceof InvalidUserNameError) {
                    throw new InvalidInputError('El nombre debe tener al menos 3 caracteres');
                }
                if (error instanceof InvalidCommunicationTypeError) {
                    throw new InvalidInputError('El tipo de comunicación debe ser SMS, EMAIL o CONSOLE');
                }
                throw error;
            }

            const updatedUser = user.update(updatedName, updatedCommunicationType);
            const savedUser = await this.userRepository.update(userId, updatedUser);
            
            const event = new UserEditedEvent(
                savedUser.id,
                user.name,
                savedUser.name,
                user.communicationType,
                savedUser.communicationType
            );
            
            await this.eventBus.publish(event);

            return savedUser;
        } catch (error) {
            if (error instanceof InvalidInputError || 
                error instanceof InvalidUserIdError || 
                error instanceof InvalidUserNameError || 
                error instanceof InvalidCommunicationTypeError ||
                error instanceof UserNotFoundError) {
                throw error;
            }
            console.error('Error al editar el usuario:', error);
            throw new Error('Error al editar el usuario: ' + (error instanceof Error ? error.message : 'Error desconocido'));
        }
    }
} 