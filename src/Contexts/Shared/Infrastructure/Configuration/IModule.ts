import { Router } from 'express';

export interface IModule {
    initialize(): void;
    getRoutes(): Router;
} 