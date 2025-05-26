import { Request, Response } from 'express';
import { CreateUserV1Command } from '@userManagement/Features/UserCreation/Application/Commands/CreateUserV1Command';
import { CreateUserV2Command } from '@userManagement/Features/UserCreation/Application/Commands/CreateUserV2Command';
import { CommandBus } from '@shared/Infrastructure/CommandBus/CommandBus';
import { InvalidUserIdError } from '@userManagement/Features/UserCreation/Domain/Errors/InvalidUserIdError';
import { InvalidUserNameError } from '@userManagement/Features/UserCreation/Domain/Errors/InvalidUserNameError';
import { InvalidCommunicationTypeError } from '@userManagement/Features/UserCreation/Domain/Errors/InvalidCommunicationTypeError';

export class CreateUserController {
    constructor(private readonly commandBus: CommandBus) {}

    async execute(req: Request, res: Response): Promise<void> {
        try {
            if (!req.body || !req.body.name || !req.body.communicationType) {
                res.status(400).json({ error: 'Datos de usuario inválidos' });
                return;
            }

            const { id, name, communicationType } = req.body;
            const apiVersion = req.params.version || '1';

            let command;
            if (apiVersion === '1') {
                command = new CreateUserV1Command(name, communicationType);
            } else if (apiVersion === '2') {
                if (!id) {
                    res.status(400).json({ error: 'El ID es requerido para la versión 2' });
                    return;
                }
                command = new CreateUserV2Command(id, name, communicationType);
            } else {
                res.status(400).json({ error: 'Versión de API no soportada' });
                return;
            }

            await this.commandBus.dispatch(command);

            res.status(201).json({
                message: 'Usuario creado exitosamente',
                data: { id: apiVersion === '1' ? 'ID generado automáticamente' : id }
            });
        } catch (error) {
            if (error instanceof InvalidUserIdError) {
                res.status(400).json({ error: error.message });
            } else if (error instanceof InvalidUserNameError) {
                res.status(400).json({ error: error.message });
            } else if (error instanceof InvalidCommunicationTypeError) {
                res.status(400).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Error interno del servidor' });
            }
        }
    }
} 