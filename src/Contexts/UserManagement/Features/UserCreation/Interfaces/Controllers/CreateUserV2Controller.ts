import { Request, Response } from 'express';
import { CommandBus } from '@shared/Infrastructure/CommandBus/CommandBus';
import { CreateUserV2Command } from '@userManagement/Features/UserCreation/Application/Commands/CreateUserV2Command';

export class CreateUserV2Controller {
    constructor(private readonly commandBus: CommandBus) {}

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const { name, communicationType, preferences } = req.body;

            if (!name || !communicationType) {
                res.status(400).json({ error: 'Name and communicationType are required' });
                return;
            }

            const command = new CreateUserV2Command(
                name,
                communicationType.toUpperCase(),
                preferences || {}
            );
            await this.commandBus.dispatch(command);

            res.status(201).json({ message: 'Usuario creado exitosamente' });
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'Error creating user' });
        }
    }
} 