import { Router } from 'express';
import { CommandBus } from '@shared/Infrastructure/CommandBus/CommandBus';
import { userRoutes } from '@userManagement/Features/UserCreation/Interfaces/Routes/userRoutes';
import { BaseModule } from '@shared/Infrastructure/Configuration/BaseModule';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { UserListingContainer } from '@userManagement/Features/UserListing/Infrastructure/Container/UserListingContainer';
import { UserEditingContainer } from '@userManagement/Features/UserEditing/Infrastructure/Container/UserEditingContainer';
import { createUserListingRoutes } from '@userManagement/Features/UserListing/Interfaces/Routes/userListingRoutes';
import { createEditUserRoutes } from '@userManagement/Features/UserEditing/Infrastructure/Routes/editUserRoutes';

export class UserManagementModule extends BaseModule {
    private readonly API_V1 = 'v1';
    private readonly API_V2 = 'v2';
    private readonly BASE_PATH = '/api';

    constructor(
        private readonly commandBus: CommandBus,
        private readonly userRepository: IUserRepository,
        private readonly eventBus: IEventBus
    ) {
        super();
    }

    initialize(): void {
        // Configurar rutas de creación de usuarios (v1 y v2)
        const userCreationRoutes = userRoutes(this.commandBus, this.userRepository, this.eventBus);
        this.router.use(this.BASE_PATH, userCreationRoutes);

        // Configurar listado de usuarios (compartido entre versiones)
        const userListingContainer = new UserListingContainer(this.userRepository);
        const listUsersController = userListingContainer.getListUsersController();
        const userListingRoutes = createUserListingRoutes(listUsersController);
        this.router.use(`${this.BASE_PATH}/${this.API_V1}/users`, userListingRoutes);
        this.router.use(`${this.BASE_PATH}/${this.API_V2}/users`, userListingRoutes);

        // Configurar edición de usuarios (compartido entre versiones)
        const userEditingContainer = new UserEditingContainer(
            this.userRepository,
            this.eventBus
        );
        const editUserRoutes = createEditUserRoutes(userEditingContainer);
        this.router.use(`${this.BASE_PATH}/${this.API_V1}/users`, editUserRoutes);
        this.router.use(`${this.BASE_PATH}/${this.API_V2}/users`, editUserRoutes);
    }
} 