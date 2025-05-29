import { CreateUserV1Controller } from '@userManagement/Features/UserCreation/Interfaces/Controllers/CreateUserV1Controller';
import { CommandBus } from '@shared/Infrastructure/CommandBus/CommandBus';
import { UserAggregate } from '@userManagement/Shared/Domain/Aggregates/UserAggregate';
import { Request, Response } from 'express';

describe('CreateUserV1Controller', () => {
    let controller: CreateUserV1Controller;
    let commandBus: jest.Mocked<CommandBus>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockUser: UserAggregate;

    beforeEach(() => {
        commandBus = {
            dispatch: jest.fn(),
            register: jest.fn()
        } as unknown as jest.Mocked<CommandBus>;

        mockUser = {
            id: { value: '123' },
            name: { value: 'Juan Pérez' },
            communicationType: { value: 'EMAIL' },
            toDTO: () => ({
                id: '123',
                name: 'Juan Pérez',
                communicationType: 'EMAIL'
            })
        } as unknown as UserAggregate;

        mockRequest = {
            body: {
                name: 'Juan Pérez',
                communicationType: 'EMAIL'
            }
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        controller = new CreateUserV1Controller(commandBus);
    });

    it('debería crear un usuario exitosamente', async () => {
        // Arrange
        commandBus.dispatch.mockResolvedValue(mockUser);

        // Act
        await controller.handle(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(commandBus.dispatch).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith({
            message: 'Usuario creado exitosamente',
            id: '123',
            user: {
                id: '123',
                name: 'Juan Pérez',
                communicationType: 'EMAIL'
            }
        });
    });

    it('debería manejar datos faltantes', async () => {
        // Arrange
        mockRequest.body = { name: 'Juan Pérez' }; // Falta communicationType

        // Act
        await controller.handle(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(commandBus.dispatch).not.toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Name and communicationType are required'
        });
    });

    it('debería manejar errores del servidor', async () => {
        // Arrange
        commandBus.dispatch.mockRejectedValue(new Error('Error interno'));

        // Act
        await controller.handle(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Error creating user'
        });
    });

    it('debería validar el tipo de comunicación', async () => {
        // Arrange
        mockRequest.body = {
            name: 'Juan Pérez',
            communicationType: 'INVALID_TYPE'
        };

        // Act
        await controller.handle(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Error creating user'
        });
    });
}); 