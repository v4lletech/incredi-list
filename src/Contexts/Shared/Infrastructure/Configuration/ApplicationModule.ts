import { Router } from 'express';
import { BaseModule } from './BaseModule';
import { IModule } from './IModule';
import { UserManagementModule } from '@userManagement/Shared/Infrastructure/Configuration/UserManagementModule';
import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { CommandBus } from '@shared/Infrastructure/CommandBus/CommandBus';

export class ApplicationModule extends BaseModule {
    private modules: IModule[] = [];
    private readonly commandBus: CommandBus;

    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventBus: IEventBus
    ) {
        super();
        this.commandBus = new CommandBus();
    }

    initialize(): void {
        // Inicializar módulos
        const userManagementModule = new UserManagementModule(
            this.commandBus,
            this.userRepository,
            this.eventBus
        );

        this.modules = [userManagementModule];

        // Inicializar cada módulo
        this.modules.forEach(module => module.initialize());

        // Configurar rutas
        this.modules.forEach(module => {
            const moduleRoutes = module.getRoutes();
            if (moduleRoutes) {
                this.router.use(moduleRoutes);
            }
        });
    }
} 