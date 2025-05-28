import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { EditUserCommandHandler } from '@userManagement/Features/UserEditing/Application/CommandHandlers/EditUserCommandHandler';
import { EditUserController } from '@userManagement/Features/UserEditing/Interfaces/Controllers/EditUserController';

export class UserEditingContainer {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventBus: IEventBus
    ) {}

    getEditUserController(): EditUserController {
        const editUserCommandHandler = new EditUserCommandHandler(
            this.userRepository,
            this.eventBus
        );
        return new EditUserController(editUserCommandHandler);
    }
} 