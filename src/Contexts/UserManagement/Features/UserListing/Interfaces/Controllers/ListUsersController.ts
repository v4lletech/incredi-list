import { Request, Response } from 'express';
import { ListUsersQuery } from '@userManagement/Features/UserListing/Application/Queries/ListUsersQuery';
import { ListUsersQueryHandler } from '@userManagement/Features/UserListing/Application/QueryHandlers/ListUsersQueryHandler';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
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
 *     ListUsersResponse:
 *       type: object
 *       properties:
 *         users:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *         total:
 *           type: integer
 *           description: Número total de usuarios
 *           example: 100
 *         page:
 *           type: integer
 *           description: Página actual
 *           example: 1
 *         limit:
 *           type: integer
 *           description: Número de elementos por página
 *           example: 10
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Mensaje de error
 *           example: "Parámetros de paginación inválidos"
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Lista usuarios
 *     description: Obtiene una lista paginada de usuarios
 *     tags: [Users]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 10
 *         description: Número de elementos por página
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ListUsersResponse'
 *       400:
 *         description: Parámetros de paginación inválidos
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
export class ListUsersController {
    constructor(
        private readonly listUsersQueryHandler: ListUsersQueryHandler
    ) {}

    async handle(req: Request, res: Response): Promise<void> {
        try {
            // Validar parámetros de paginación primero
            const pageParam = req.query.page as string;
            const limitParam = req.query.limit as string;

            // Si se proporcionan parámetros, deben ser números válidos
            if (pageParam && (isNaN(Number(pageParam)) || Number(pageParam) < 1)) {
                res.status(400).json({
                    error: 'Parámetros de paginación inválidos'
                });
                return;
            }

            if (limitParam && (isNaN(Number(limitParam)) || Number(limitParam) < 1)) {
                res.status(400).json({
                    error: 'Parámetros de paginación inválidos'
                });
                return;
            }

            const page = pageParam ? Number(pageParam) : 1;
            const limit = limitParam ? Number(limitParam) : 10;

            const query = new ListUsersQuery(page, limit);
            const result = await this.listUsersQueryHandler.execute(query);

            res.status(200).json({
                users: result.users,
                total: result.total,
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages
            });
        } catch (error) {
            console.error('Error al listar usuarios:', error);
            res.status(500).json({
                error: 'Error interno del servidor'
            });
        }
    }
} 