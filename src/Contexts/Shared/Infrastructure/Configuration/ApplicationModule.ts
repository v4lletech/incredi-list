import { Router } from 'express';
import { BaseModule } from './BaseModule';
import { IModule } from './IModule';
import { UserManagementModule } from '@userManagement/Shared/Infrastructure/Configuration/UserManagementModule';
import { MessagingModule } from '@messaging/Infrastructure/Configuration/MessagingModule';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';

export class ApplicationModule extends BaseModule {
    private modules: IModule[] = [];

    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventBus: IEventBus
    ) {
        super();
    }

    initialize(): void {
        // Inicializar módulos
        const userManagementModule = new UserManagementModule(this.userRepository, this.eventBus);
        const messagingModule = new MessagingModule(this.eventBus);

        this.modules = [userManagementModule, messagingModule];

        // Inicializar cada módulo
        this.modules.forEach(module => module.initialize());

        // Configurar rutas
        this.modules.forEach(module => {
            this.router.use(module.getRoutes());
        });
    }
} 