import { EditUserController } from '@userManagement/Features/UserEditing/Interfaces/Controllers/EditUserController';
import { CommandBus } from '@shared/Infrastructure/CommandBus/CommandBus';
import { UserAggregate } from '@userManagement/Shared/Domain/Aggregates/UserAggregate';
import { Request, Response } from 'express';
import { UserNotFoundError } from '@userManagement/Features/UserEditing/Domain/Errors/UserNotFoundError';
import { UserDTO } from '@userManagement/Features/UserListing/Application/DTOs/UserDTO';
import { InvalidInputError } from '@userManagement/Features/UserEditing/Domain/Errors/InvalidInputError';
import { InvalidUserIdError } from '@userManagement/Shared/Domain/Errors/InvalidUserIdError';
import { InvalidUserNameError } from '@userManagement/Shared/Domain/Errors/InvalidUserNameError';
import { InvalidCommunicationTypeError } from '@userManagement/Shared/Domain/Errors/InvalidCommunicationTypeError';

describe('EditUserController', () => {
    let controller: EditUserController;
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
            params: { id: '123' },
            body: {
                name: 'Juan Pérez Actualizado',
                communicationType: 'SMS'
            }
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        controller = new EditUserController(commandBus);
    });

    describe('handle', () => {
        it('debería actualizar un usuario exitosamente', async () => {
            // Arrange
            const updatedUser = {
                ...mockUser,
                name: { value: 'Juan Pérez Actualizado' },
                communicationType: { value: 'SMS' },
                toDTO: () => ({
                    id: '123',
                    name: 'Juan Pérez Actualizado',
                    communicationType: 'SMS'
                })
            } as unknown as UserAggregate;
            commandBus.dispatch.mockResolvedValue(updatedUser);

            // Act
            await controller.handle(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(commandBus.dispatch).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Usuario actualizado exitosamente',
                user: new UserDTO(
                    '123',
                    'Juan Pérez Actualizado',
                    'SMS'
                )
            });
        });

        it('debería mantener valores existentes si no se proporcionan nuevos', async () => {
            // Arrange
            mockRequest.body = {}; // Sin campos de actualización
            commandBus.dispatch.mockResolvedValue(mockUser);

            // Act
            await controller.handle(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(commandBus.dispatch).toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(200);
            expect(mockResponse.json).toHaveBeenCalledWith({
                message: 'Usuario actualizado exitosamente',
                user: new UserDTO(
                    '123',
                    'Juan Pérez',
                    'EMAIL'
                )
            });
        });

        it('debería manejar el error de usuario no encontrado', async () => {
            // Arrange
            commandBus.dispatch.mockRejectedValue(new UserNotFoundError('Usuario no encontrado'));

            // Act
            await controller.handle(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(404);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Usuario no encontrado'
            });
        });

        it('debería manejar errores de validación con código 400', async () => {
            // Arrange
            const validationErrors = [
                new InvalidInputError('Datos de entrada inválidos'),
                new InvalidUserIdError('ID de usuario inválido'),
                new InvalidUserNameError('Nombre de usuario inválido'),
                new InvalidCommunicationTypeError('Tipo de comunicación inválido')
            ];

            for (const error of validationErrors) {
                commandBus.dispatch.mockRejectedValue(error);

                // Act
                await controller.handle(mockRequest as Request, mockResponse as Response);

                // Assert
                expect(mockResponse.status).toHaveBeenCalledWith(400);
                expect(mockResponse.json).toHaveBeenCalledWith({
                    error: error.message
                });
            }
        });

        it('debería manejar errores del servidor con código 500', async () => {
            // Arrange
            const serverError = new Error('Error interno del servidor');
            commandBus.dispatch.mockRejectedValue(serverError);

            // Act
            await controller.handle(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(mockResponse.status).toHaveBeenCalledWith(500);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'Error interno del servidor'
            });
        });

        it('debería validar que el ID del usuario esté presente', async () => {
            // Arrange
            mockRequest.params = {};

            // Act
            await controller.handle(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(commandBus.dispatch).not.toHaveBeenCalled();
            expect(mockResponse.status).toHaveBeenCalledWith(400);
            expect(mockResponse.json).toHaveBeenCalledWith({
                error: 'ID de usuario es requerido'
            });
        });
    });
}); 