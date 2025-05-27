import { UserCreationContainer } from '@userManagement/Features/UserCreation/Infrastructure/Container/UserCreationContainer';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { CreateUserV1Controller } from '@userManagement/Features/UserCreation/Interfaces/Controllers/CreateUserV1Controller';
import { CreateUserV2Controller } from '@userManagement/Features/UserCreation/Interfaces/Controllers/CreateUserV2Controller';
import { Request, Response } from 'express';
import { CommandBus } from '@shared/Infrastructure/CommandBus/CommandBus';

describe('UserCreationContainer', () => {
    let mockUserRepository: jest.Mocked<IUserRepository>;
    let mockEventBus: jest.Mocked<IEventBus>;
    let commandBus: CommandBus;
    let container: UserCreationContainer;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        mockUserRepository = {
            create: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        };

        mockEventBus = {
            publish: jest.fn(),
            subscribe: jest.fn(),
            unsubscribe: jest.fn()
        };

        commandBus = new CommandBus();

        mockRequest = {
            body: {
                name: 'Test User',
                communicationType: 'EMAIL'
            }
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        container = UserCreationContainer.create(mockUserRepository, mockEventBus, commandBus);
    });

    it('debería crear y retornar el controlador V1', () => {
        const v1Controller = container.getController('v1');
        expect(v1Controller).toBeInstanceOf(CreateUserV1Controller);
    });

    it('debería crear y retornar el controlador V2', () => {
        const v2Controller = container.getController('v2');
        expect(v2Controller).toBeInstanceOf(CreateUserV2Controller);
    });

    it('debería reutilizar los controladores cuando se solicitan múltiples veces', () => {
        const v1Controller1 = container.getController('v1');
        const v1Controller2 = container.getController('v1');
        
        expect(v1Controller1).toBe(v1Controller2);
    });

    it('debería inicializar los command handlers al construirse', async () => {
        const v1Controller = container.getController('v1');
        
        // Intentar crear un usuario debería funcionar sin errores
        await expect(
            v1Controller.handle(mockRequest as Request, mockResponse as Response)
        ).resolves.not.toThrow();
    });
}); 