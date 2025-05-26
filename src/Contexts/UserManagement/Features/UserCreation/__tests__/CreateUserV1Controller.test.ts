import { Request, Response } from 'express';
import { CommandBus } from '@shared/Infrastructure/CommandBus/CommandBus';
import { CreateUserV1Controller } from '../Interfaces/Controllers/CreateUserV1Controller';
import { IUserCreationFactory } from '@userManagement/Features/UserCreation/Infrastructure/Factories/IUserCreationFactory';
import { CreateUserV1Command } from '@userManagement/Features/UserCreation/Application/Commands/CreateUserV1Command';

describe('CreateUserV1Controller', () => {
    let controller: CreateUserV1Controller;
    let mockCommandBus: jest.Mocked<CommandBus>;
    let mockFactory: jest.Mocked<IUserCreationFactory>;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;

    beforeEach(() => {
        mockCommandBus = {
            dispatch: jest.fn()
        } as any;

        mockFactory = {
            createCommand: jest.fn()
        } as any;

        mockRequest = {
            body: {
                name: 'Test User',
                communicationType: 'email'
            }
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        controller = new CreateUserV1Controller(mockCommandBus, mockFactory);
    });

    it('should create a user successfully', async () => {
        const mockCommand = new CreateUserV1Command('Test User', 'email');
        mockFactory.createCommand.mockReturnValue(mockCommand);

        await controller.handle(mockRequest as Request, mockResponse as Response);

        expect(mockFactory.createCommand).toHaveBeenCalledWith('v1', {
            name: 'Test User',
            communicationType: 'email'
        });
        expect(mockCommandBus.dispatch).toHaveBeenCalledWith(mockCommand);
        expect(mockResponse.status).toHaveBeenCalledWith(201);
        expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Usuario creado exitosamente' });
    });

    it('should handle errors appropriately', async () => {
        const error = new Error('Test error');
        mockFactory.createCommand.mockImplementation(() => {
            throw error;
        });

        await controller.handle(mockRequest as Request, mockResponse as Response);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Test error' });
    });
}); 