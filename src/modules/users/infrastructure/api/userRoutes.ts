import { Router, Request, Response } from 'express';
import { UserContainer } from '../container';

const router = Router();
const container = new UserContainer();

router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, communicationType } = req.body;
        const user = await container.createUserHandler.handle(name, communicationType);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

router.get('/', async (req: Request, res: Response) => {
    try {
        const users = await container.listUsersHandler.handle();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

export default router; 