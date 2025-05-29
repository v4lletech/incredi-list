import { InMemoryUserRepository } from '@userManagement/Shared/Infrastructure/Persistence/InMemoryUserRepository';
import { InMemoryEventBus } from '@shared/Infrastructure/EventBus/InMemoryEventBus';
import { CommandBus } from '@shared/Infrastructure/CommandBus/CommandBus';
import { UserManagementModule } from '@userManagement/Shared/Infrastructure/Configuration/UserManagementModule';
import { CreateUserV1Command } from '@userManagement/Features/UserCreation/Application/Commands/CreateUserV1Command';
import { EditUserCommand } from '@userManagement/Features/UserEditing/Application/Commands/EditUserCommand';
import { UserCreatedEvent } from '@userManagement/Features/UserCreation/Domain/Events/UserCreatedEvent';
import { UserEditedEvent } from '@userManagement/Features/UserEditing/Domain/Events/UserEditedEvent';
import { UserId } from '@userManagement/Shared/Domain/ValueObjects/UserId';
import { UserName } from '@userManagement/Shared/Domain/ValueObjects/UserName';
import { CommunicationType } from '@userManagement/Shared/Domain/ValueObjects/CommunicationType';
import { AggregateRoot } from '@shared/Domain/Aggregates/AggregateRoot';
import { UserAggregate } from '@userManagement/Shared/Domain/Aggregates/UserAggregate';

describe('UserManagement Integration Tests', () => {
    let userRepository: InMemoryUserRepository;
    let eventBus: InMemoryEventBus;
    let commandBus: CommandBus;
    let userManagementModule: UserManagementModule;
    let capturedEvents: any[] = [];

    beforeEach(() => {
        userRepository = new InMemoryUserRepository();
        eventBus = new InMemoryEventBus();
        commandBus = new CommandBus();
        userManagementModule = new UserManagementModule(commandBus, userRepository, eventBus);
        
        // Capturar eventos publicados
        capturedEvents = [];
        eventBus.publish = jest.fn().mockImplementation(async (event) => {
            capturedEvents.push(event);
        });

        userManagementModule.initialize();
    });

    afterEach(async () => {
        await userRepository.clear();
        capturedEvents = [];
    });

    describe('Flujo de Creación y Edición de Usuario', () => {
        it('debería propagar eventos correctamente en el flujo de creación y edición', async () => {
            // Arrange
            const createCommand = new CreateUserV1Command('Juan Pérez', 'EMAIL');
            
            // Act - Crear usuario
            const createdUser = await commandBus.dispatch(createCommand) as UserAggregate;
            const createdUserDTO = createdUser.toDTO();
            
            // Assert - Verificar evento de creación
            expect(capturedEvents).toHaveLength(1);
            expect(capturedEvents[0]).toBeInstanceOf(UserCreatedEvent);
            expect(capturedEvents[0].id).toBeInstanceOf(UserId);
            expect(capturedEvents[0].name).toBeInstanceOf(UserName);
            expect(capturedEvents[0].communicationType).toBeInstanceOf(CommunicationType);

            // Act - Editar usuario
            const editCommand = new EditUserCommand(
                createdUserDTO.id,
                'Juan Pérez Actualizado',
                'SMS'
            );
            const updatedUser = await commandBus.dispatch(editCommand) as UserAggregate;

            // Assert - Verificar evento de edición
            expect(capturedEvents).toHaveLength(2);
            expect(capturedEvents[1]).toBeInstanceOf(UserEditedEvent);
            expect(capturedEvents[1].userId).toBeInstanceOf(UserId);
            expect(capturedEvents[1].oldName).toBeInstanceOf(UserName);
            expect(capturedEvents[1].newName).toBeInstanceOf(UserName);
            expect(capturedEvents[1].oldCommunicationType).toBeInstanceOf(CommunicationType);
            expect(capturedEvents[1].newCommunicationType).toBeInstanceOf(CommunicationType);
        });

        it('debería mantener la consistencia de datos entre eventos', async () => {
            // Arrange
            const createCommand = new CreateUserV1Command('Juan Pérez', 'EMAIL');
            
            // Act - Crear usuario
            const createdUser = await commandBus.dispatch(createCommand) as UserAggregate;
            const createdUserDTO = createdUser.toDTO();
            
            // Assert - Verificar datos en evento de creación
            const createEvent = capturedEvents[0] as UserCreatedEvent;
            expect(createEvent.id.value).toBe(createdUserDTO.id);
            expect(createEvent.name.value).toBe('Juan Pérez');
            expect(createEvent.communicationType.value).toBe('EMAIL');

            // Act - Editar usuario
            const editCommand = new EditUserCommand(
                createdUserDTO.id,
                'Juan Pérez Actualizado',
                'SMS'
            );
            const updatedUser = await commandBus.dispatch(editCommand) as UserAggregate;

            // Assert - Verificar datos en evento de edición
            const editEvent = capturedEvents[1] as UserEditedEvent;
            expect(editEvent.userId.value).toBe(createdUserDTO.id);
            expect(editEvent.oldName.value).toBe('Juan Pérez');
            expect(editEvent.newName.value).toBe('Juan Pérez Actualizado');
            expect(editEvent.oldCommunicationType.value).toBe('EMAIL');
            expect(editEvent.newCommunicationType.value).toBe('SMS');
        });

        it('debería manejar correctamente la secuencia de eventos', async () => {
            // Arrange
            const createCommand = new CreateUserV1Command('Juan Pérez', 'EMAIL');
            
            // Act - Crear y editar usuario
            const createdUser = await commandBus.dispatch(createCommand) as UserAggregate;
            const createdUserDTO = createdUser.toDTO();
            const editCommand = new EditUserCommand(
                createdUserDTO.id,
                'Juan Pérez Actualizado',
                'SMS'
            );
            await commandBus.dispatch(editCommand);

            // Assert - Verificar secuencia de eventos
            expect(capturedEvents[0].occurredOn).toBeInstanceOf(Date);
            expect(capturedEvents[1].occurredOn).toBeInstanceOf(Date);
            expect(capturedEvents[0].occurredOn.getTime()).toBeLessThan(capturedEvents[1].occurredOn.getTime());
        });
    });
}); 