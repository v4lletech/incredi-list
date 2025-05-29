import { ListUsersController } from '@userManagement/Features/UserListing/Interfaces/Controllers/ListUsersController';
import { ListUsersQueryHandler } from '@userManagement/Features/UserListing/Application/QueryHandlers/ListUsersQueryHandler';
import { Request, Response } from 'express';
import { ListUsersResponseDTO } from '@userManagement/Features/UserListing/Application/DTOs/UserDTO';

describe('ListUsersController', () => {
    let controller: ListUsersController;
    let queryHandler: jest.Mocked<ListUsersQueryHandler>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        queryHandler = {
            execute: jest.fn()
        } as unknown as jest.Mocked<ListUsersQueryHandler>;

        mockRequest = {
            query: {
                page: '1',
                limit: '10'
            }
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        controller = new ListUsersController(queryHandler);
    });

    it('debería listar usuarios exitosamente', async () => {
        // Arrange
        const mockResponseDTO = new ListUsersResponseDTO(
            [
                { id: '1', name: 'Usuario 1', communicationType: 'EMAIL' },
                { id: '2', name: 'Usuario 2', communicationType: 'SMS' }
            ],
            2,
            1,
            10,
            1
        );
        queryHandler.execute.mockResolvedValue(mockResponseDTO);

        // Act
        await controller.handle(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(queryHandler.execute).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            users: mockResponseDTO.users,
            total: mockResponseDTO.total,
            page: mockResponseDTO.page,
            limit: mockResponseDTO.limit,
            totalPages: mockResponseDTO.totalPages
        });
    });

    it('debería manejar parámetros de paginación personalizados', async () => {
        // Arrange
        mockRequest.query = {
            page: '2',
            limit: '5'
        };
        const mockResponseDTO = new ListUsersResponseDTO(
            [
                { id: '6', name: 'Usuario 6', communicationType: 'EMAIL' },
                { id: '7', name: 'Usuario 7', communicationType: 'SMS' }
            ],
            7,
            2,
            5,
            2
        );
        queryHandler.execute.mockResolvedValue(mockResponseDTO);

        // Act
        await controller.handle(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(queryHandler.execute).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            users: mockResponseDTO.users,
            total: mockResponseDTO.total,
            page: mockResponseDTO.page,
            limit: mockResponseDTO.limit,
            totalPages: mockResponseDTO.totalPages
        });
    });

    it('debería manejar lista vacía de usuarios', async () => {
        // Arrange
        const mockResponseDTO = new ListUsersResponseDTO(
            [],
            0,
            1,
            10,
            0
        );
        queryHandler.execute.mockResolvedValue(mockResponseDTO);

        // Act
        await controller.handle(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(queryHandler.execute).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith({
            users: [],
            total: 0,
            page: 1,
            limit: 10,
            totalPages: 0
        });
    });

    it('debería manejar errores del query handler', async () => {
        // Arrange
        queryHandler.execute.mockRejectedValue(new Error('Error interno'));

        // Act
        await controller.handle(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Error interno del servidor'
        });
    });

    it('debería validar parámetros de paginación inválidos', async () => {
        // Arrange
        mockRequest.query = {
            page: 'invalid',
            limit: 'invalid'
        };

        // Act
        await controller.handle(mockRequest as Request, mockResponse as Response);

        // Assert
        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: 'Parámetros de paginación inválidos'
        });
    });
}); 