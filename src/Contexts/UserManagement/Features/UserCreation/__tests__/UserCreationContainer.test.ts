import { UserCreationContainer } from '../Infrastructure/Container/UserCreationContainer';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { CreateUserV1Controller } from '../Interfaces/Controllers/CreateUserV1Controller';
import { CreateUserV2Controller } from '../Interfaces/Controllers/CreateUserV2Controller';
import { Request, Response } from 'express';

describe('UserCreationContainer', () => {
    let mockUserRepository: jest.Mocked<IUserRepository>;
    let mockEventBus: jest.Mocked<IEventBus>;
    let container: UserCreationContainer;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        mockUserRepository = {
            save: jest.fn(),
            findById: jest.fn(),
            findAll: jest.fn(),
            count: jest.fn()
        };

        mockEventBus = {
            publish: jest.fn(),
            subscribe: jest.fn()
        };

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

        container = UserCreationContainer.create(mockUserRepository, mockEventBus);
    });

    it('debería crear y retornar el controlador V1', () => {
        const v1Controller = container.getV1Controller();
        expect(v1Controller).toBeInstanceOf(CreateUserV1Controller);
    });

    it('debería crear y retornar el controlador V2', () => {
        const v2Controller = container.getV2Controller();
        expect(v2Controller).toBeInstanceOf(CreateUserV2Controller);
    });

    it('debería reutilizar los controladores cuando se solicitan múltiples veces', () => {
        const v1Controller1 = container.getV1Controller();
        const v1Controller2 = container.getV1Controller();
        
        expect(v1Controller1).toBe(v1Controller2);
    });

    it('debería inicializar los command handlers al construirse', async () => {
        const v1Controller = container.getV1Controller();
        
        // Intentar crear un usuario debería funcionar sin errores
        await expect(
            v1Controller.handle(mockRequest as Request, mockResponse as Response)
        ).resolves.not.toThrow();
    });
}); 