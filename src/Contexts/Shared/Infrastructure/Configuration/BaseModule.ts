import { Router } from 'express';
import { IModule } from '@shared/Infrastructure/Configuration/IModule';

export abstract class BaseModule implements IModule {
    protected router: Router;

    constructor() {
        this.router = Router();
    }

    abstract initialize(): void;

    getRoutes(): Router {
        return this.router;
    }
} 