import { ApplicationModule } from '@shared/Infrastructure/Configuration/ApplicationModule';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { UserManagementModule } from '@userManagement/Shared/Infrastructure/Configuration/UserManagementModule';
import { MessagingModule } from '@messaging/Shared/Infrastructure/Configuration/MessagingModule';
import express from 'express';

jest.mock('@userManagement/Shared/Infrastructure/Configuration/UserManagementModule');
jest.mock('@messaging/Shared/Infrastructure/Configuration/MessagingModule');

describe('ApplicationModule', () => {
    let userRepository: jest.Mocked<IUserRepository>;
    let eventBus: jest.Mocked<IEventBus>;
    let applicationModule: ApplicationModule;

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
        applicationModule = new ApplicationModule(userRepository, eventBus);
    });

    it('should initialize user management module', () => {
        applicationModule.initialize();

        expect(UserManagementModule).toHaveBeenCalledWith(
            expect.any(Object),
            userRepository,
            eventBus
        );
        expect(UserManagementModule.prototype.initialize).toHaveBeenCalled();
    });

    it('should initialize messaging module', () => {
        applicationModule.initialize();

        expect(MessagingModule).toHaveBeenCalledWith(eventBus);
        expect(MessagingModule.prototype.initialize).toHaveBeenCalled();
    });

    it('debería retornar un router con las rutas de los módulos', () => {
        // Arrange
        const mockRouter = express.Router();
        (UserManagementModule.prototype.getRoutes as jest.Mock).mockReturnValue(mockRouter);

        // Act
        applicationModule.initialize();
        const router = applicationModule.getRoutes();

        // Assert
        expect(router).toBeDefined();
    });
}); 