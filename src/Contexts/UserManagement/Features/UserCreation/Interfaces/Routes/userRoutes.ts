import { Router } from 'express';
import { CreateUserController } from '@userManagement/Features/UserCreation/Interfaces/Controllers/CreateUserController';

export const createUserRoutes = (createUserController: CreateUserController): Router => {
    const router = Router();

    router.post('/', (req, res) => createUserController.handle(req, res));

    return router;
}; 