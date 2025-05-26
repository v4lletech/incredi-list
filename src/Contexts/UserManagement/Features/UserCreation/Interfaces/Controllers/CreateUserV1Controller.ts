import { Request, Response } from 'express';
import { CommandBus } from '@shared/Infrastructure/CommandBus/CommandBus';
import { CreateUserV1Command } from '@userManagement/Features/UserCreation/Application/Commands/CreateUserV1Command';

export class CreateUserV1Controller {
    constructor(private readonly commandBus: CommandBus) {}

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const { name, communicationType } = req.body;

            if (!name || !communicationType) {
                res.status(400).json({ error: 'Name and communicationType are required' });
                return;
            }

            const command = new CreateUserV1Command(name, communicationType.toUpperCase());
            await this.commandBus.dispatch(command);

            res.status(201).json({ message: 'Usuario creado exitosamente' });
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'Error creating user' });
        }
    }
} 