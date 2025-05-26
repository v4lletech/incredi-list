import { BaseModule } from '@shared/Infrastructure/Configuration/BaseModule';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { UserCreationContainer } from '@userManagement/Features/UserCreation/Infrastructure/Container/UserCreationContainer';
import { UserListingContainer } from '@userManagement/Features/UserListing/Infrastructure/Container/UserListingContainer';
import { UserEditingContainer } from '@userManagement/Features/UserEditing/Infrastructure/Container/UserEditingContainer';
import { createUserRoutes } from '@userManagement/Features/UserCreation/Interfaces/Routes/userRoutes';
import { createUserListingRoutes } from '@userManagement/Features/UserListing/Interfaces/Routes/userListingRoutes';
import { createEditUserRoutes } from '@userManagement/Features/UserEditing/Infrastructure/Routes/editUserRoutes';

export class UserManagementModule extends BaseModule {
    private readonly API_VERSION = 'v1';
    private readonly BASE_PATH = `/api/${this.API_VERSION}/users`;

    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventBus: IEventBus
    ) {
        super();
    }

    initialize(): void {
        // Configurar creación de usuarios
        const userCreationContainer = new UserCreationContainer(
            this.userRepository,
            this.eventBus
        );
        const createUserController = userCreationContainer.getCreateUserController();
        this.router.use(this.BASE_PATH, createUserRoutes(createUserController));

        // Configurar listado de usuarios
        const userListingContainer = new UserListingContainer(this.userRepository);
        const listUsersController = userListingContainer.getListUsersController();
        this.router.use(this.BASE_PATH, createUserListingRoutes(listUsersController));

        // Configurar edición de usuarios
        const userEditingContainer = new UserEditingContainer(
            this.userRepository,
            this.eventBus
        );
        this.router.use(this.BASE_PATH, createEditUserRoutes(userEditingContainer));
    }
} 