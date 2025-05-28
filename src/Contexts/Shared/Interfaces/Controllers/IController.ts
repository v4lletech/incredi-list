interface ICreateUserController {
    handle(req: Request, res: Response): Promise<void>;
}

export default ICreateUserController;