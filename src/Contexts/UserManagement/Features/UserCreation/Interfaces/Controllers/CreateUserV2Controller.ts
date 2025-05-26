import { Request, Response } from 'express';
import { CommandBus } from '@shared/Infrastructure/CommandBus/CommandBus';
import { IUserCreationFactory } from '@userManagement/Features/UserCreation/Infrastructure/Factories/IUserCreationFactory';

export class CreateUserV2Controller {
    constructor(
        private readonly commandBus: CommandBus,
        private readonly factory: IUserCreationFactory
    ) {}

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const command = this.factory.createCommand('v2', {
                id: req.body.id,
                name: req.body.name,
                communicationType: req.body.communicationType
            });

            await this.commandBus.dispatch(command);
            res.status(201).json({ message: 'Usuario creado exitosamente' });
        } catch (error) {
            res.status(400).json({ 
                error: error instanceof Error ? error.message : 'Error desconocido' 
            });
        }
    }
} 