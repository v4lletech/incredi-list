import { Router } from 'express';
import { CreateUserController } from '@userManagement/Features/UserCreation/Interfaces/Controllers/CreateUserController';

export const createUserRoutes = (createUserController: CreateUserController): Router => {
    const router = Router();

    // POST /api/v1/users
    router.post('/v1', (req, res) => createUserController.execute(req, res));

    // POST /api/v2/users
    router.post('/v2', (req, res) => createUserController.execute(req, res));

    return router;
}; 