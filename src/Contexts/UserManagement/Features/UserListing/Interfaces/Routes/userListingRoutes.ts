import { Router } from 'express';
import { ListUsersController } from '@userManagement/Features/UserListing/Interfaces/Controllers/ListUsersController';

export const createUserListingRoutes = (listUsersController: ListUsersController): Router => {
    const router = Router();

    // GET /api/v1/users
    router.get('/', (req, res) => listUsersController.handle(req, res));

    return router;
}; 