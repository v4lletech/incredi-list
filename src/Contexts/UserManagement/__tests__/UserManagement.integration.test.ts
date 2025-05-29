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
import { DomainEvent } from '@shared/Domain/Events/DomainEvent';

describe('UserManagement Integration Tests', () => {
    let userRepository: InMemoryUserRepository;
    let eventBus: InMemoryEventBus;
    let commandBus: CommandBus;
    let userManagementModule: UserManagementModule;
    let capturedEvents: DomainEvent[];

    beforeEach(() => {
        userRepository = new InMemoryUserRepository();
        eventBus = new InMemoryEventBus();
        commandBus = new CommandBus();
        capturedEvents = [];

        // Capturar eventos para verificación
        eventBus.subscribe(UserCreatedEvent.name, async (event: DomainEvent) => {
            capturedEvents.push(event);
        });
        eventBus.subscribe(UserEditedEvent.name, async (event: DomainEvent) => {
            capturedEvents.push(event);
        });

        userManagementModule = new UserManagementModule(
            commandBus,
            userRepository,
            eventBus
        );
        userManagementModule.initialize();
    });

    afterEach(async () => {
        await userRepository.clear();
        capturedEvents = [];
    });

    describe('Flujo de Creación y Edición de Usuario', () => {
        it('debería manejar correctamente la secuencia de eventos', async () => {
            // Arrange
            const createCommand = new CreateUserV1Command('Juan Pérez', 'EMAIL');
            
            // Act
            const createdUser = await commandBus.dispatch(createCommand) as UserAggregate;
            
            // Esperar un momento para asegurar que los timestamps sean diferentes
            await new Promise(resolve => setTimeout(resolve, 10));
            
            const editCommand = new EditUserCommand(
                createdUser.id.value,
                'Juan Pérez Actualizado',
                'SMS'
            );
            const updatedUser = await commandBus.dispatch(editCommand) as UserAggregate;

            // Assert
            expect(capturedEvents).toHaveLength(2);
            expect(capturedEvents[0]).toBeInstanceOf(UserCreatedEvent);
            expect(capturedEvents[1]).toBeInstanceOf(UserEditedEvent);

            // Verificar que los eventos tienen timestamps válidos
            expect(capturedEvents[0].occurredOn).toBeInstanceOf(Date);
            expect(capturedEvents[1].occurredOn).toBeInstanceOf(Date);
            
            // Verificar que los eventos ocurrieron en el orden correcto
            expect(capturedEvents[0].occurredOn.getTime()).toBeLessThan(capturedEvents[1].occurredOn.getTime());

            // Verificar el contenido de los eventos
            const createdEvent = capturedEvents[0] as UserCreatedEvent;
            const editedEvent = capturedEvents[1] as UserEditedEvent;

            expect(createdEvent.id.value).toBe(createdUser.id.value);
            expect(createdEvent.name.value).toBe('Juan Pérez');
            expect(createdEvent.communicationType.value).toBe('EMAIL');

            expect(editedEvent.userId.value).toBe(updatedUser.id.value);
            expect(editedEvent.oldName.value).toBe('Juan Pérez');
            expect(editedEvent.newName.value).toBe('Juan Pérez Actualizado');
            expect(editedEvent.oldCommunicationType.value).toBe('EMAIL');
            expect(editedEvent.newCommunicationType.value).toBe('SMS');
        });

        it('debería mantener la consistencia de los datos después de múltiples operaciones', async () => {
            // Arrange
            const createCommand = new CreateUserV1Command('Juan Pérez', 'EMAIL');
            
            // Act
            const createdUser = await commandBus.dispatch(createCommand) as UserAggregate;
            
            // Esperar un momento para asegurar que los timestamps sean diferentes
            await new Promise(resolve => setTimeout(resolve, 10));
            
            const editCommand = new EditUserCommand(
                createdUser.id.value,
                'Juan Pérez Actualizado',
                'SMS'
            );
            const updatedUser = await commandBus.dispatch(editCommand) as UserAggregate;

            // Assert
            const retrievedUser = await userRepository.findById(createdUser.id);
            expect(retrievedUser).not.toBeNull();
            expect(retrievedUser?.name.value).toBe('Juan Pérez Actualizado');
            expect(retrievedUser?.communicationType.value).toBe('SMS');
        });
    });
}); 