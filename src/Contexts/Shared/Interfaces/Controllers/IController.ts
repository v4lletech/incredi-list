import { Request, Response } from 'express';

export interface IController {
    handle(req: Request, res: Response): Promise<void>;
}

export default IController;