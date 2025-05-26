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
    private readonly API_V1 = 'v1';
    private readonly API_V2 = 'v2';
    private readonly BASE_PATH_V1 = `/api/${this.API_V1}/users`;
    private readonly BASE_PATH_V2 = `/api/${this.API_V2}/users`;

    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventBus: IEventBus
    ) {
        super();
    }

    initialize(): void {
        // Configurar creación de usuarios v1 (UUID generado automáticamente)
        const userCreationContainerV1 = new UserCreationContainer(
            this.userRepository,
            this.eventBus,
            true // autoGenerateId = true
        );
        const createUserControllerV1 = userCreationContainerV1.getCreateUserController();
        this.router.use(this.BASE_PATH_V1, createUserRoutes(createUserControllerV1));

        // Configurar creación de usuarios v2 (ID proporcionado)
        const userCreationContainerV2 = new UserCreationContainer(
            this.userRepository,
            this.eventBus,
            false // autoGenerateId = false
        );
        const createUserControllerV2 = userCreationContainerV2.getCreateUserController();
        this.router.use(this.BASE_PATH_V2, createUserRoutes(createUserControllerV2));

        // Configurar listado de usuarios (compartido entre versiones)
        const userListingContainer = new UserListingContainer(this.userRepository);
        const listUsersController = userListingContainer.getListUsersController();
        this.router.use(this.BASE_PATH_V1, createUserListingRoutes(listUsersController));
        this.router.use(this.BASE_PATH_V2, createUserListingRoutes(listUsersController));

        // Configurar edición de usuarios (compartido entre versiones)
        const userEditingContainer = new UserEditingContainer(
            this.userRepository,
            this.eventBus
        );
        this.router.use(this.BASE_PATH_V1, createEditUserRoutes(userEditingContainer));
        this.router.use(this.BASE_PATH_V2, createEditUserRoutes(userEditingContainer));
    }
} 