import { Request, Response } from 'express';
import { CreateUserController } from '@userManagement/Features/UserCreation/Interfaces/Controllers/CreateUserController';
import { CommandHandler } from '@shared/Domain/Common/CommandHandler';
import { CreateUserCommand } from '@userManagement/Features/UserCreation/Application/Commands/CreateUserCommand';
import { InvalidUserNameError } from '@userManagement/Features/UserCreation/Domain/Errors/InvalidUserNameError';
import { InvalidCommunicationTypeError } from '@userManagement/Features/UserCreation/Domain/Errors/InvalidCommunicationTypeError';

describe('CreateUserController', () => {
    let mockCommandHandler: jest.Mocked<CommandHandler<CreateUserCommand>>;
    let controller: CreateUserController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
        mockCommandHandler = {
            execute: jest.fn()
        };

        mockJson = jest.fn();
        mockStatus = jest.fn().mockReturnValue({ json: mockJson });

        mockRequest = {
            body: {
                id: '123',
                name: 'John Doe',
                communicationType: 'EMAIL'
            }
        };

        mockResponse = {
            status: mockStatus,
            json: mockJson
        };

        controller = new CreateUserController(mockCommandHandler);
    });

    it('debería crear un usuario exitosamente', async () => {
        await controller.handle(mockRequest as Request, mockResponse as Response);

        expect(mockCommandHandler.execute).toHaveBeenCalledWith(
            expect.any(CreateUserCommand)
        );
        expect(mockStatus).toHaveBeenCalledWith(201);
        expect(mockJson).toHaveBeenCalledWith({
            message: 'Usuario creado exitosamente'
        });
    });

    it('debería manejar error de nombre inválido', async () => {
        const error = new InvalidUserNameError('El nombre debe tener al menos 3 caracteres');
        mockCommandHandler.execute.mockRejectedValueOnce(error);

        await controller.handle(mockRequest as Request, mockResponse as Response);

        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({
            error: error.message
        });
    });

    it('debería manejar error de tipo de comunicación inválido', async () => {
        const error = new InvalidCommunicationTypeError('El tipo de comunicación debe ser SMS, EMAIL o CONSOLE');
        mockCommandHandler.execute.mockRejectedValueOnce(error);

        await controller.handle(mockRequest as Request, mockResponse as Response);

        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({
            error: error.message
        });
    });

    it('debería manejar errores inesperados', async () => {
        const error = new Error('Error inesperado');
        mockCommandHandler.execute.mockRejectedValueOnce(error);

        await controller.handle(mockRequest as Request, mockResponse as Response);

        expect(mockStatus).toHaveBeenCalledWith(500);
        expect(mockJson).toHaveBeenCalledWith({
            error: 'Error interno del servidor'
        });
    });

    it('debería manejar request sin body', async () => {
        mockRequest = {};

        await controller.handle(mockRequest as Request, mockResponse as Response);

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
            }
        };

        await controller.handle(mockRequest as Request, mockResponse as Response);

        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({
            error: 'Datos de usuario inválidos'
        });
    });

    it('debería manejar request con body vacío', async () => {
        mockRequest = {
            body: {}
        };

        await controller.handle(mockRequest as Request, mockResponse as Response);

        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({
            error: 'Datos de usuario inválidos'
        });
    });
}); 