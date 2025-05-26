import { Request, Response } from 'express';
import { EditUserController } from '@userManagement/Features/UserEditing/Infrastructure/Controllers/EditUserController';
import { EditUserCommandHandler } from '@userManagement/Features/UserEditing/Application/CommandHandlers/EditUserCommandHandler';
import { InvalidInputError } from '@userManagement/Features/UserEditing/Domain/Errors/InvalidInputError';
import { UserNotFoundError } from '@userManagement/Features/UserEditing/Domain/Errors/UserNotFoundError';

describe('EditUserController', () => {
    let mockCommandHandler: jest.Mocked<EditUserCommandHandler>;
    let controller: EditUserController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
        mockCommandHandler = {
            execute: jest.fn()
        } as unknown as jest.Mocked<EditUserCommandHandler>;

        mockJson = jest.fn();
        mockStatus = jest.fn().mockReturnValue({ json: mockJson });

        mockRequest = {
            params: {
                id: '123'
            },
            body: {
                name: 'Jane Doe',
                communicationType: 'SMS'
            }
        };

        mockResponse = {
            status: mockStatus,
            json: mockJson
        };

        controller = new EditUserController(mockCommandHandler);
    });

    it('debería editar un usuario exitosamente', async () => {
        // Act
        await controller.handle(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockCommandHandler.execute).toHaveBeenCalled();
        expect(mockStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith({
            message: 'Usuario actualizado exitosamente'
        });
    });

    it('debería manejar error de entrada inválida', async () => {
        // Arrange
        const error = new InvalidInputError('El ID es requerido');
        mockCommandHandler.execute.mockRejectedValue(error);

        // Act
        await controller.handle(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({
            error: error.message
        });
    });

    it('debería manejar error de usuario no encontrado', async () => {
        // Arrange
        const error = new UserNotFoundError('Usuario no encontrado');
        mockCommandHandler.execute.mockRejectedValue(error);

        // Act
        await controller.handle(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockStatus).toHaveBeenCalledWith(404);
        expect(mockJson).toHaveBeenCalledWith({
            error: error.message
        });
    });

    it('debería manejar errores inesperados', async () => {
        // Arrange
        const error = new Error('Error inesperado');
        mockCommandHandler.execute.mockRejectedValue(error);

        // Act
        await controller.handle(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockStatus).toHaveBeenCalledWith(500);
        expect(mockJson).toHaveBeenCalledWith({
            error: 'Error interno del servidor'
        });
    });

    it('debería manejar request sin body', async () => {
        // Arrange
        mockRequest = {
            params: {
                id: '123'
            }
        };

        // Act
        await controller.handle(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockCommandHandler.execute).toHaveBeenCalledWith(
            expect.objectContaining({
                id: '123',
                name: undefined,
                communicationType: undefined
            })
        );
        expect(mockStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith({
            message: 'Usuario actualizado exitosamente'
        });
    });

    it('debería manejar request sin ID en params', async () => {
        // Arrange
        mockRequest = {
            params: {},
            body: {
                name: 'Jane Doe',
                communicationType: 'SMS'
            }
        };

        // Act
        await controller.handle(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockStatus).toHaveBeenCalledWith(400);
        expect(mockJson).toHaveBeenCalledWith({
            error: 'El ID es requerido'
        });
    });
}); 