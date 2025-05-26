import { CreateUserV1Controller } from '@userManagement/Features/UserCreation/Interfaces/Controllers/CreateUserV1Controller';
import { CreateUserV2Controller } from '@userManagement/Features/UserCreation/Interfaces/Controllers/CreateUserV2Controller';
import { CreateUserV1Command } from '@userManagement/Features/UserCreation/Application/Commands/CreateUserV1Command';
import { CreateUserV2Command } from '@userManagement/Features/UserCreation/Application/Commands/CreateUserV2Command';
import { ICommandHandler } from '@shared/Infrastructure/CommandBus/ICommandHandler';

export interface IUserCreationFactory {
    createController(version: 'v1' | 'v2'): CreateUserV1Controller | CreateUserV2Controller;
    createCommandHandler(version: 'v1' | 'v2'): ICommandHandler<CreateUserV1Command | CreateUserV2Command>;
    createCommand(version: 'v1' | 'v2', data: any): CreateUserV1Command | CreateUserV2Command;
} 