import { CreateUserV2Controller } from '@userManagement/Features/UserCreation/Interfaces/Controllers/CreateUserV2Controller';
import { CommandBus } from '@shared/Infrastructure/CommandBus/CommandBus';
import { UserAggregate } from '@userManagement/Shared/Domain/Aggregates/UserAggregate';
import { Request, Response } from 'express';
import { InvalidUserIdError } from '@userManagement/Shared/Domain/Errors/InvalidUserIdError';
import { InvalidUserNameError } from '@userManagement/Shared/Domain/Errors/InvalidUserNameError';
import { InvalidCommunicationTypeError } from '@userManagement/Shared/Domain/Errors/InvalidCommunicationTypeError';

describe('CreateUserV2Controller', () => {
    let controller: CreateUserV2Controller;
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
                id: '123',
                name: 'Juan Pérez',
                communicationType: 'EMAIL'
            }
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        controller = new CreateUserV2Controller(commandBus);
    });

    describe('handle', () => {
        it('debería crear un usuario exitosamente', async () => {
            // Arrange
            commandBus.dispatch.mockResolvedValue(mockUser);

            // Act
            await controller.handle(mockRequest as Request, mockResponse as Response);

            // Assert
            expect(commandBus.dispatch).toHaveBeenCalledWith(expect.objectContaining({
                id: '123',
                name: 'Juan Pérez',
                communicationType: 'EMAIL'
            }));
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

        describe('validaciones de entrada', () => {
            it('debería validar que el id sea requerido', async () => {
                // Arrange
                mockRequest.body = { name: 'Juan Pérez', communicationType: 'EMAIL' };

                // Act
                await controller.handle(mockRequest as Request, mockResponse as Response);

                // Assert
                expect(commandBus.dispatch).not.toHaveBeenCalled();
                expect(mockResponse.status).toHaveBeenCalledWith(400);
                expect(mockResponse.json).toHaveBeenCalledWith({
                    error: 'ID, name and communicationType are required'
                });
            });

            it('debería validar que el nombre sea requerido', async () => {
                // Arrange
                mockRequest.body = { id: '123', communicationType: 'EMAIL' };

                // Act
                await controller.handle(mockRequest as Request, mockResponse as Response);

                // Assert
                expect(commandBus.dispatch).not.toHaveBeenCalled();
                expect(mockResponse.status).toHaveBeenCalledWith(400);
                expect(mockResponse.json).toHaveBeenCalledWith({
                    error: 'ID, name and communicationType are required'
                });
            });

            it('debería validar que el tipo de comunicación sea requerido', async () => {
                // Arrange
                mockRequest.body = { id: '123', name: 'Juan Pérez' };

                // Act
                await controller.handle(mockRequest as Request, mockResponse as Response);

                // Assert
                expect(commandBus.dispatch).not.toHaveBeenCalled();
                expect(mockResponse.status).toHaveBeenCalledWith(400);
                expect(mockResponse.json).toHaveBeenCalledWith({
                    error: 'ID, name and communicationType are required'
                });
            });
        });

        describe('manejo de errores', () => {
            it('debería manejar errores de ID inválido', async () => {
                // Arrange
                const error = new InvalidUserIdError('ID inválido');
                commandBus.dispatch.mockRejectedValue(error);

                // Act
                await controller.handle(mockRequest as Request, mockResponse as Response);

                // Assert
                expect(mockResponse.status).toHaveBeenCalledWith(500);
                expect(mockResponse.json).toHaveBeenCalledWith({
                    error: 'Error creating user'
                });
            });

            it('debería manejar errores de nombre inválido', async () => {
                // Arrange
                const error = new InvalidUserNameError('Nombre inválido');
                commandBus.dispatch.mockRejectedValue(error);

                // Act
                await controller.handle(mockRequest as Request, mockResponse as Response);

                // Assert
                expect(mockResponse.status).toHaveBeenCalledWith(500);
                expect(mockResponse.json).toHaveBeenCalledWith({
                    error: 'Error creating user'
                });
            });

            it('debería manejar errores de tipo de comunicación inválido', async () => {
                // Arrange
                const error = new InvalidCommunicationTypeError('Tipo de comunicación inválido');
                commandBus.dispatch.mockRejectedValue(error);

                // Act
                await controller.handle(mockRequest as Request, mockResponse as Response);

                // Assert
                expect(mockResponse.status).toHaveBeenCalledWith(500);
                expect(mockResponse.json).toHaveBeenCalledWith({
                    error: 'Error creating user'
                });
            });

            it('debería manejar errores inesperados', async () => {
                // Arrange
                const unexpectedError = new Error('Error inesperado');
                commandBus.dispatch.mockRejectedValue(unexpectedError);

                // Act
                await controller.handle(mockRequest as Request, mockResponse as Response);

                // Assert
                expect(mockResponse.status).toHaveBeenCalledWith(500);
                expect(mockResponse.json).toHaveBeenCalledWith({
                    error: 'Error creating user'
                });
            });
        });

        describe('validaciones de tipo de comunicación', () => {
            it('debería aceptar tipos de comunicación válidos', async () => {
                // Arrange
                const validTypes = ['EMAIL', 'SMS', 'CONSOLE'];
                
                for (const type of validTypes) {
                    mockRequest.body.communicationType = type;
                    commandBus.dispatch.mockResolvedValue(mockUser);

                    // Act
                    await controller.handle(mockRequest as Request, mockResponse as Response);

                    // Assert
                    expect(mockResponse.status).toHaveBeenCalledWith(201);
                    expect(commandBus.dispatch).toHaveBeenCalledWith(expect.objectContaining({
                        communicationType: type
                    }));
                }
            });

            it('debería manejar tipos de comunicación inválidos', async () => {
                // Arrange
                mockRequest.body.communicationType = 'INVALID_TYPE';
                const error = new InvalidCommunicationTypeError('Tipo de comunicación inválido');
                commandBus.dispatch.mockRejectedValue(error);

                // Act
                await controller.handle(mockRequest as Request, mockResponse as Response);

                // Assert
                expect(mockResponse.status).toHaveBeenCalledWith(500);
                expect(mockResponse.json).toHaveBeenCalledWith({
                    error: 'Error creating user'
                });
            });
        });
    });
}); 