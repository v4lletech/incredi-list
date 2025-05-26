import { Request, Response } from 'express';
import { ListUsersQuery } from '@userManagement/Features/UserListing/Application/Queries/ListUsersQuery';
import { ListUsersQueryHandler } from '@userManagement/Features/UserListing/Application/QueryHandlers/ListUsersQueryHandler';

export class ListUsersController {
    constructor(
        private readonly listUsersQueryHandler: ListUsersQueryHandler
    ) {}

    async handle(req: Request, res: Response): Promise<void> {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const query = new ListUsersQuery(page, limit);
            const result = await this.listUsersQueryHandler.execute(query);

            res.status(200).json(result);
        } catch (error) {
            console.error('Error al listar usuarios:', error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
} 