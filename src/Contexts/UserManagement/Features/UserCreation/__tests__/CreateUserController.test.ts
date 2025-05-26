import { Request, Response } from 'express';
import { CreateUserController } from '@userManagement/Features/UserCreation/Interfaces/Controllers/CreateUserController';
import { CommandBus } from '@shared/Infrastructure/CommandBus/CommandBus';
import { CreateUserV1Command } from '@userManagement/Features/UserCreation/Application/Commands/CreateUserV1Command';
import { CreateUserV2Command } from '@userManagement/Features/UserCreation/Application/Commands/CreateUserV2Command';
import { InvalidUserNameError } from '@userManagement/Features/UserCreation/Domain/Errors/InvalidUserNameError';
import { InvalidCommunicationTypeError } from '@userManagement/Features/UserCreation/Domain/Errors/InvalidCommunicationTypeError';

describe('CreateUserController', () => {
    let mockCommandBus: jest.Mocked<CommandBus>;
    let controller: CreateUserController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
        mockCommandBus = {
            dispatch: jest.fn(),
            register: jest.fn()
        } as unknown as jest.Mocked<CommandBus>;

        mockJson = jest.fn();
        mockStatus = jest.fn().mockReturnValue({ json: mockJson });

        mockRequest = {
            body: {
                id: '123',
                name: 'John Doe',
                communicationType: 'EMAIL'
            },
            params: {
                version: '1'
            }
        };

        mockResponse = {
            status: mockStatus,
            json: mockJson
        };

        controller = new CreateUserController(mockCommandBus);
    });

    it('debería crear un usuario exitosamente con versión 1', async () => {
        await controller.execute(mockRequest as Request, mockResponse as Response);

        expect(mockCommandBus.dispatch).toHaveBeenCalledWith(
            expect.any(CreateUserV1Command)
        );
        expect(mockStatus).toHaveBeenCalledWith(201);
        expect(mockJson).toHaveBeenCalledWith({
            message: 'Usuario creado exitosamente',
            data: { id: 'ID generado automáticamente' }
        });
    });

    it('debería crear un usuario exitosamente con versión 2', async () => {
        mockRequest.params = { version: '2' };
        await controller.execute(mockRequest as Request, mockResponse as Response);

        expect(mockCommandBus.dispatch).toHaveBeenCalledWith(
            expect.any(CreateUserV2Command)
        );
        expect(mockStatus).toHaveBeenCalledWith(201);
        expect(mockJson).toHaveBeenCalledWith({
            message: 'Usuario creado exitosamente',
            data: { id: '123' }
        });
    });

    it('debería manejar error de nombre inválido', async () => {
        const error = new InvalidUserNameError('El nombre debe tener al menos 3 caracteres');
        mockCommandBus.dispatch.mockRejectedValueOnce(error);

        await controller.execute(mockRequest as Request, mockResponse as Response);

        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({
            error: error.message
        });
    });

    it('debería manejar error de tipo de comunicación inválido', async () => {
        const error = new InvalidCommunicationTypeError('El tipo de comunicación debe ser SMS, EMAIL o CONSOLE');
        mockCommandBus.dispatch.mockRejectedValueOnce(error);

        await controller.execute(mockRequest as Request, mockResponse as Response);

        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({
            error: error.message
        });
    });

    it('debería manejar errores inesperados', async () => {
        const error = new Error('Error inesperado');
        mockCommandBus.dispatch.mockRejectedValueOnce(error);

        await controller.execute(mockRequest as Request, mockResponse as Response);

        expect(mockStatus).toHaveBeenCalledWith(500);
        expect(mockJson).toHaveBeenCalledWith({
            error: 'Error interno del servidor'
        });
    });

    it('debería manejar request sin body', async () => {
        mockRequest = {
            params: { version: '1' }
        };

        await controller.execute(mockRequest as Request, mockResponse as Response);

        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({
            error: 'Datos de usuario inválidos'
        });
    });

    it('debería manejar request con body incompleto', async () => {
        mockRequest = {
            body: {
                id: '123',
                name: 'John Doe'
                // Falta communicationType
            },
            params: { version: '1' }
        };

        await controller.execute(mockRequest as Request, mockResponse as Response);

        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({
            error: 'Datos de usuario inválidos'
        });
    });

    it('debería manejar versión de API no soportada', async () => {
        mockRequest.params = { version: '3' };
        await controller.execute(mockRequest as Request, mockResponse as Response);

        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({
            error: 'Versión de API no soportada'
        });
    });
}); 