import { Request, Response } from 'express';
import { EditUserCommand } from '@userManagement/Features/UserEditing/Application/Commands/EditUserCommand';
import { EditUserCommandHandler } from '@userManagement/Features/UserEditing/Application/CommandHandlers/EditUserCommandHandler';
import { InvalidInputError } from '@userManagement/Features/UserEditing/Domain/Errors/InvalidInputError';
import { UserNotFoundError } from '@userManagement/Features/UserEditing/Domain/Errors/UserNotFoundError';

export class EditUserController {
    constructor(private readonly editUserCommandHandler: EditUserCommandHandler) {}

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { name, communicationType } = req.body;

            if (!id) {
                res.status(500).json({ error: 'Error interno del servidor' });
                return;
            }

            if (!req.body || !name || !communicationType) {
                res.status(400).json({ error: 'Datos de usuario inválidos' });
                return;
            }

            const command = new EditUserCommand(id, name, communicationType);
            await this.editUserCommandHandler.execute(command);

            res.status(200).json({ message: 'Usuario actualizado exitosamente' });
        } catch (error) {
            if (error instanceof InvalidInputError) {
                res.status(400).json({ error: error.message });
            } else if (error instanceof UserNotFoundError) {
                res.status(404).json({ error: error.message });
            } else {
                console.error('Error inesperado:', error);
                res.status(500).json({ error: 'Error interno del servidor' });
            }
        }
    }
} 