import { IUserRepository } from '@userManagement/Shared/Domain/Repositories/IUserRepository';
import { IEventBus } from '@shared/Infrastructure/EventBus/IEventBus';
import { IUserCreationFactory } from '@userManagement/Features/UserCreation/Infrastructure/Factories/IUserCreationFactory';
import { CreateUserV1Controller } from '@userManagement/Features/UserCreation/Interfaces/Controllers/CreateUserV1Controller';
import { CreateUserV2Controller } from '@userManagement/Features/UserCreation/Interfaces/Controllers/CreateUserV2Controller';
import { ICommandHandler } from '@shared/Infrastructure/CommandBus/ICommandHandler';
import { CreateUserV1Command } from '@userManagement/Features/UserCreation/Application/Commands/CreateUserV1Command';
import { CreateUserV2Command } from '@userManagement/Features/UserCreation/Application/Commands/CreateUserV2Command';
import { CommandBus } from '@shared/Infrastructure/CommandBus/CommandBus';
import { UserCreatedEvent } from '@userManagement/Features/UserCreation/Domain/Events/UserCreatedEvent';
import { UserId } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Features/UserCreation/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Features/UserCreation/Domain/ValueObjects/CommunicationType';

export class UserCreationFactory implements IUserCreationFactory {
    constructor(
        private readonly userRepository: IUserRepository,
        private readonly eventBus: IEventBus,
        private readonly commandBus: CommandBus
    ) {}

    createController(version: string): CreateUserV1Controller | CreateUserV2Controller {
        switch (version) {
            case 'v1':
                return new CreateUserV1Controller(this.commandBus);
            case 'v2':
                return new CreateUserV2Controller(this.commandBus);
            default:
                throw new Error(`Invalid version: ${version}`);
        }
    }

    createCommand(version: string, data: any): CreateUserV1Command | CreateUserV2Command {
        switch (version) {
            case 'v1':
                return new CreateUserV1Command(data.name, data.communicationType);
            case 'v2':
                return new CreateUserV2Command(data.name, data.communicationType, data.preferences);
            default:
                throw new Error(`Invalid version: ${version}`);
        }
    }

    createCommandHandler(version: string): ICommandHandler<CreateUserV1Command | CreateUserV2Command> {
        switch (version) {
            case 'v1':
                return {
                    handle: async (command: CreateUserV1Command) => {
                        const user = await this.userRepository.create({
                            name: command.name,
                            communicationType: command.communicationType
                        });

                        if (!user.id || !user.name || !user.communicationType) {
                            throw new Error('Usuario creado con datos incompletos');
                        }

                        const event = new UserCreatedEvent(
                            UserId.create(user.id),
                            UserName.create(user.name),
                            CommunicationType.create(user.communicationType)
                        );
                        await this.eventBus.publish([event]);
                    }
                };
            case 'v2':
                return {
                    handle: async (command: CreateUserV2Command) => {
                        const user = await this.userRepository.create({
                            name: command.name,
                            communicationType: command.communicationType,
                            preferences: command.preferences
                        });

                        if (!user.id || !user.name || !user.communicationType) {
                            throw new Error('Usuario creado con datos incompletos');
                        }

                        const event = new UserCreatedEvent(
                            UserId.create(user.id),
                            UserName.create(user.name),
                            CommunicationType.create(user.communicationType)
                        );
                        await this.eventBus.publish([event]);
                    }
                };
            default:
                throw new Error(`Invalid version: ${version}`);
        }
    }
} 