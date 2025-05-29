import { Request, Response } from 'express';
import { CommandBus } from '@shared/Infrastructure/CommandBus/CommandBus';
import { EditUserCommand } from '@userManagement/Features/UserEditing/Application/Commands/EditUserCommand';
import { UserAggregate } from '@userManagement/Shared/Domain/Aggregates/UserAggregate';
import { UserDTO } from '@userManagement/Features/UserListing/Application/DTOs/UserDTO';
import { UserNotFoundError } from '@userManagement/Features/UserEditing/Domain/Errors/UserNotFoundError';
import { InvalidInputError } from '@userManagement/Features/UserEditing/Domain/Errors/InvalidInputError';
import { InvalidUserIdError } from '@userManagement/Shared/Domain/Errors/InvalidUserIdError';
import { InvalidUserNameError } from '@userManagement/Shared/Domain/Errors/InvalidUserNameError';
import { InvalidCommunicationTypeError } from '@userManagement/Shared/Domain/Errors/InvalidCommunicationTypeError';

/**
 * @swagger
 * components:
 *   schemas:
 *     EditUserRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: Nuevo nombre del usuario
 *           example: "Juan Pérez Actualizado"
 *         communicationType:
 *           type: string
 *           description: Nuevo tipo de comunicación preferida
 *           enum: [SMS, EMAIL, CONSOLE]
 *           example: "SMS"
 *     EditUserResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Mensaje de confirmación
 *           example: "Usuario actualizado exitosamente"
 */

/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Actualiza un usuario existente
 *     description: Actualiza el nombre y/o tipo de comunicación de un usuario existente
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EditUserRequest'
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EditUserResponse'
 *       400:
 *         description: Datos de entrada inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuario no encontrado
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
export class EditUserController {
    constructor(private readonly commandBus: CommandBus) {}

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { name, communicationType } = req.body;

            if (!id) {
                res.status(400).json({ error: 'ID de usuario es requerido' });
                return;
            }

            const command = new EditUserCommand(id, name, communicationType);
            const updatedUser = await this.commandBus.dispatch(command) as UserAggregate;

            res.status(200).json({
                message: 'Usuario actualizado exitosamente',
                user: new UserDTO(
                    updatedUser.id.value,
                    updatedUser.name.value,
                    updatedUser.communicationType.value
                )
            });
        } catch (error) {
            if (error instanceof UserNotFoundError) {
                res.status(404).json({ error: error.message });
            } else if (error instanceof InvalidInputError || 
                      error instanceof InvalidUserIdError || 
                      error instanceof InvalidUserNameError || 
                      error instanceof InvalidCommunicationTypeError) {
                res.status(400).json({ error: error.message });
            } else {
                console.error('Error al actualizar usuario:', error);
                res.status(500).json({ error: 'Error interno del servidor' });
            }
        }
    }
} 