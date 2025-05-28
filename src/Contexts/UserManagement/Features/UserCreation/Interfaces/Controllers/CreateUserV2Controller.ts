import { Request, Response } from 'express';
import { CommandBus } from '@shared/Infrastructure/CommandBus/CommandBus';
import { CreateUserV2Command } from '@userManagement/Features/UserCreation/Application/Commands/CreateUserV2Command';
import { UserAggregate } from '@userManagement/Shared/Domain/Aggregates/UserAggregate';

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateUserV2Request:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - communicationType
 *       properties:
 *         id:
 *           type: string
 *           description: ID único del usuario
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         name:
 *           type: string
 *           description: Nombre del usuario
 *           example: "Juan Pérez"
 *         communicationType:
 *           type: string
 *           description: Tipo de comunicación preferida
 *           enum: [SMS, EMAIL, CONSOLE]
 *           example: "EMAIL"
 *     CreateUserV2Response:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Mensaje de confirmación
 *           example: "Usuario creado exitosamente"
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Mensaje de error
 *           example: "ID, name and communicationType are required"
 */

/**
 * @swagger
 * /api/v2/users:
 *   post:
 *     summary: Crea un nuevo usuario (v2)
 *     description: Crea un nuevo usuario con ID específico y tipo de comunicación
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserV2Request'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUserV2Response'
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
export class CreateUserV2Controller {
    constructor(private readonly commandBus: CommandBus) {}

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const { id, name, communicationType } = req.body;

            if (!id || !name || !communicationType) {
                res.status(400).json({ error: 'ID, name and communicationType are required' });
                return;
            }

            const command = new CreateUserV2Command(
                id,
                name,
                communicationType.toUpperCase()
            );
            const userAggregate = await this.commandBus.dispatch(command) as UserAggregate;

            res.status(201).json({
                message: 'Usuario creado exitosamente',
                id: userAggregate.id.value,
                user: userAggregate.toDTO()
            });
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'Error creating user' });
        }
    }
} 