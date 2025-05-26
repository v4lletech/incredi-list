import { Request, Response } from 'express';
import { CreateUserCommand } from '@userManagement/Features/UserCreation/Application/Commands/CreateUserCommand';
import { CommandHandler } from '@shared/Domain/Common/CommandHandler';
import { InvalidUserNameError } from '@userManagement/Features/UserCreation/Domain/Errors/InvalidUserNameError';
import { InvalidCommunicationTypeError } from '@userManagement/Features/UserCreation/Domain/Errors/InvalidCommunicationTypeError';

export class CreateUserController {
    constructor(
        private readonly createUserCommandHandler: CommandHandler<CreateUserCommand>
    ) {}

    async handle(req: Request, res: Response): Promise<void> {
        try {
            if (!req.body || !req.body.id || !req.body.name || !req.body.communicationType) {
                res.status(400).json({ error: 'Datos de usuario inválidos' });
                return;
            }

            const { id, name, communicationType } = req.body;

            const command = new CreateUserCommand(id, name, communicationType);
            await this.createUserCommandHandler.execute(command);

            res.status(201).json({ message: 'Usuario creado exitosamente' });
        } catch (error) {
            if (error instanceof InvalidUserNameError || error instanceof InvalidCommunicationTypeError) {
                res.status(400).json({ error: error.message });
            } else {
                console.error('Error inesperado:', error);
                res.status(500).json({ error: 'Error interno del servidor' });
            }
        }
    }
} 