import { Request, Response } from 'express';
import { CommandBus } from '@shared/Infrastructure/CommandBus/CommandBus';
import { CreateUserV1Command } from '@userManagement/Features/UserCreation/Application/Commands/CreateUserV1Command';

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUserV1Request:
 *       type: object
 *       required:
 *         - name
 *         - communicationType
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre del usuario
 *           example: "Juan Pérez"
 *         communicationType:
 *           type: string
 *           description: Tipo de comunicación preferida
 *           enum: [SMS, EMAIL, CONSOLE]
 *           example: "EMAIL"
 *     CreateUserV1Response:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Mensaje de confirmación
 *           example: "Usuario creado exitosamente"
 */

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Crea un nuevo usuario (v1)
 *     description: Crea un nuevo usuario con nombre y tipo de comunicación. El ID se genera automáticamente.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserV1Request'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUserV1Response'
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
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