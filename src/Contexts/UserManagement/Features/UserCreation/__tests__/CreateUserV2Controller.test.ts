import { Request, Response } from 'express';
import { CommandBus } from '@shared/Infrastructure/CommandBus/CommandBus';
import { CreateUserV2Controller } from '../Interfaces/Controllers/CreateUserV2Controller';
import { IUserCreationFactory } from '@userManagement/Features/UserCreation/Infrastructure/Factories/IUserCreationFactory';
import { CreateUserV2Command } from '@userManagement/Features/UserCreation/Application/Commands/CreateUserV2Command';

describe('CreateUserV2Controller', () => {
    let controller: CreateUserV2Controller;
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
                id: '123e4567-e89b-12d3-a456-426614174000',
                name: 'Test User',
                communicationType: 'email'
            }
        };

        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        controller = new CreateUserV2Controller(mockCommandBus, mockFactory);
    });

    it('should create a user successfully', async () => {
        const mockCommand = new CreateUserV2Command(
            '123e4567-e89b-12d3-a456-426614174000',
            'Test User',
            'email'
        );
        mockFactory.createCommand.mockReturnValue(mockCommand);

        await controller.handle(mockRequest as Request, mockResponse as Response);

        expect(mockFactory.createCommand).toHaveBeenCalledWith('v2', {
            id: '123e4567-e89b-12d3-a456-426614174000',
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