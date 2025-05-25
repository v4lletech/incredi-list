import { Router, Request, Response } from 'express';
import { UserContainer } from '@users/infrastructure/container';
import { CreateUserCommand } from '@users/application/commands/CreateUserCommand';
import { ListUsersQuery } from '@users/application/queries/ListUsersQuery';

const router = Router();
const container = new UserContainer();

router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, communicationType } = req.body;
        const command = new CreateUserCommand(name, communicationType);
        const user = await container.createUserCommandHandler.handle(command);
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
});

router.get('/', async (req: Request, res: Response) => {
    try {
        const query = new ListUsersQuery();
        const users = await container.listUsersQueryHandler.handle(query);
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

export default router; 