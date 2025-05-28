import { Router } from 'express';
import { UserEditingContainer } from '@userManagement/Features/UserEditing/Infrastructure/Container/UserEditingContainer';

export function createEditUserRoutes(container: UserEditingContainer): Router {
    const router = Router();
    const editUserController = container.getEditUserController();

    // PUT /api/v1/users/:id
    router.put('/:id', (req, res) => editUserController.handle(req, res));

    return router;
} 