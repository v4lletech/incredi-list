import { Request, Response } from 'express';
import { ListUsersController } from '@userManagement/Features/UserListing/Interfaces/Controllers/ListUsersController';
import { ListUsersQueryHandler } from '@userManagement/Features/UserListing/Application/QueryHandlers/ListUsersQueryHandler';
import { ListUsersResponseDTO, UserDTO } from '@userManagement/Features/UserListing/Application/DTOs/UserDTO';

describe('ListUsersController', () => {
    let mockQueryHandler: jest.Mocked<ListUsersQueryHandler>;
    let controller: ListUsersController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockJson: jest.Mock;
    let mockStatus: jest.Mock;

    beforeEach(() => {
        mockQueryHandler = {
            execute: jest.fn()
        } as unknown as jest.Mocked<ListUsersQueryHandler>;

        mockJson = jest.fn();
        mockStatus = jest.fn().mockReturnValue({ json: mockJson });

        mockRequest = {
            query: {
                page: '1',
                limit: '10'
            }
        };

        mockResponse = {
            status: mockStatus,
            json: mockJson
        };

        controller = new ListUsersController(mockQueryHandler);
    });

    it('debería listar usuarios exitosamente', async () => {
        // Arrange
        const mockResponseDTO = new ListUsersResponseDTO(
            [
                new UserDTO('1', 'John Doe', 'EMAIL'),
                new UserDTO('2', 'Jane Smith', 'SMS')
            ],
            2,
            1,
            10,
            1
        );

        mockQueryHandler.execute.mockResolvedValue(mockResponseDTO);

        // Act
        await controller.handle(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockQueryHandler.execute).toHaveBeenCalled();
        expect(mockStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith(mockResponseDTO);
    });

    it('debería usar valores por defecto cuando no se proporcionan parámetros', async () => {
        // Arrange
        mockRequest = { query: {} };
        const mockResponseDTO = new ListUsersResponseDTO([], 0, 1, 10, 0);
        mockQueryHandler.execute.mockResolvedValue(mockResponseDTO);

        // Act
        await controller.handle(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockQueryHandler.execute).toHaveBeenCalled();
        expect(mockStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith(mockResponseDTO);
    });

    it('debería manejar errores del query handler', async () => {
        // Arrange
        const error = new Error('Error al listar usuarios');
        mockQueryHandler.execute.mockRejectedValue(error);

        // Act
        await controller.handle(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockStatus).toHaveBeenCalledWith(500);
        expect(mockJson).toHaveBeenCalledWith({
            error: 'Error interno del servidor'
        });
    });

    it('debería manejar parámetros de paginación inválidos', async () => {
        // Arrange
        mockRequest = {
            query: {
                page: 'invalid',
                limit: 'invalid'
            }
        };

        const mockResponseDTO = new ListUsersResponseDTO([], 0, 1, 10, 0);
        mockQueryHandler.execute.mockResolvedValue(mockResponseDTO);

        // Act
        await controller.handle(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockQueryHandler.execute).toHaveBeenCalled();
        expect(mockStatus).toHaveBeenCalledWith(200);
        expect(mockJson).toHaveBeenCalledWith(mockResponseDTO);
    });
}); 