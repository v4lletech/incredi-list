import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { EditUserCommandHandler } from '@userManagement/Features/UserEditing/Application/CommandHandlers/EditUserCommandHandler';
import { EditUserController } from '@userManagement/Features/UserEditing/Interfaces/Controllers/EditUserController';
import { CommandBus } from '@shared/Infrastructure/CommandBus/CommandBus';
import { EditUserCommand } from '@userManagement/Features/UserEditing/Application/Commands/EditUserCommand';

export class UserEditingContainer {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventBus: IEventBus,
        private readonly commandBus: CommandBus
    ) {}

    getEditUserController(): EditUserController {
        const editUserCommandHandler = new EditUserCommandHandler(
            this.userRepository,
            this.eventBus
        );

        this.commandBus.register(EditUserCommand.name, editUserCommandHandler);

        return new EditUserController(this.commandBus);
    }
} 