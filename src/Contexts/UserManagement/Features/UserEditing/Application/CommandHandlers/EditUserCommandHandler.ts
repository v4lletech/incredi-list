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
            
            const userAggregate = UserAggregate.fromDTO({
                id: command.id,
                name: command.name ?? '',
                communicationType: command.communicationType ?? ''
            });
            
            //const userId = UserId.create(command.id);
            const user = await this.userRepository.findById(userAggregate.id);

            if (!user) {
                throw new UserNotFoundError(userAggregate.id.value);
            }

            // TODO: refactor to use UserEditedEvent; no se debe lanzar el evento desde el constructor
            // const updatedUser = user.update(
            //     command.name && command.name.trim() !== '' ? UserName.create(command.name) : undefined,
            //     command.communicationType && command.communicationType.trim() !== '' ? CommunicationType.create(command.communicationType) : undefined
            // );
            const updatedUser = user.update(userAggregate.name, userAggregate.communicationType);

            await this.userRepository.update(userAggregate.id, updatedUser);
            
            const event = new UserEditedEvent(
                updatedUser.id,
                updatedUser.name,
                updatedUser.communicationType
            );
            
            await this.eventBus.publish(event);

            return updatedUser;
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