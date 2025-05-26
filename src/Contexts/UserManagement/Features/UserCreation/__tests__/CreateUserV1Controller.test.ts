import { Request, Response } from 'express';
import { CommandBus } from '@shared/Infrastructure/CommandBus/CommandBus';
import { CreateUserV1Controller } from '../Interfaces/Controllers/CreateUserV1Controller';
import { CreateUserV1Command } from '@userManagement/Features/UserCreation/Application/Commands/CreateUserV1Command';

describe('CreateUserV1Controller', () => {
    let controller: CreateUserV1Controller;
    let mockCommandBus: jest.Mocked<CommandBus>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        mockCommandBus = {
            dispatch: jest.fn()
        } as any;

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

        controller = new CreateUserV1Controller(mockCommandBus);
    });

    it('should create a user successfully', async () => {
        await controller.handle(mockRequest as Request, mockResponse as Response);

        expect(mockCommandBus.dispatch).toHaveBeenCalledWith(
            expect.any(CreateUserV1Command)
        );
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Usuario creado exitosamente' });
    });

    it('should handle missing required fields', async () => {
        mockRequest.body = {};

        await controller.handle(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ 
            error: 'Name and communicationType are required' 
        });
    });

    it('should handle errors appropriately', async () => {
        const error = new Error('Test error');
        mockCommandBus.dispatch.mockRejectedValueOnce(error);

        await controller.handle(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Error creating user' });
    });
}); 