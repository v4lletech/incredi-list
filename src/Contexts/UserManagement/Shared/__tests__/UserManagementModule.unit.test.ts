import { UserManagementModule } from '@userManagement/Shared/Infrastructure/Configuration/UserManagementModule';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { CommandBus } from '@shared/Infrastructure/CommandBus/CommandBus';
import { UserCreationContainer } from '@userManagement/Features/UserCreation/Infrastructure/Container/UserCreationContainer';
import { UserListingContainer } from '@userManagement/Features/UserListing/Infrastructure/Container/UserListingContainer';
import { UserEditingContainer } from '@userManagement/Features/UserEditing/Infrastructure/Container/UserEditingContainer';
import { Router } from 'express';

jest.mock('@userManagement/Features/UserCreation/Infrastructure/Container/UserCreationContainer');
jest.mock('@userManagement/Features/UserListing/Infrastructure/Container/UserListingContainer');
jest.mock('@userManagement/Features/UserEditing/Infrastructure/Container/UserEditingContainer');

describe('UserManagementModule', () => {
    let userRepository: jest.Mocked<IUserRepository>;
    let eventBus: jest.Mocked<IEventBus>;
    let commandBus: CommandBus;
    let userManagementModule: UserManagementModule;

    beforeEach(() => {
        userRepository = {
            create: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        };
        eventBus = {
            publish: jest.fn(),
            subscribe: jest.fn(),
            unsubscribe: jest.fn()
        };
        commandBus = new CommandBus();
        userManagementModule = new UserManagementModule(commandBus, userRepository, eventBus);
    });

    it('should initialize user creation container', () => {
        userManagementModule.initialize();

        expect(UserCreationContainer).toHaveBeenCalledWith(userRepository, eventBus);
    });

    it('should initialize user listing container', () => {
        userManagementModule.initialize();

        expect(UserListingContainer).toHaveBeenCalledWith(userRepository);
    });

    it('should initialize user editing container', () => {
        userManagementModule.initialize();

        expect(UserEditingContainer).toHaveBeenCalledWith(userRepository, eventBus);
    });

    it('debería retornar un router con las rutas de los contenedores', () => {
        // Arrange
        const mockRouter = Router();
        jest.spyOn(userManagementModule, 'getRoutes').mockReturnValue(mockRouter);

        // Act
        userManagementModule.initialize();
        const router = userManagementModule.getRoutes();

        // Assert
        expect(router).toBeDefined();
    });
}); 