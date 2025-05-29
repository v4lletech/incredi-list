import { CommandBus } from '../Shared/Infrastructure/CommandBus/CommandBus';
import { AggregateRoot } from '@shared/Domain/Aggregates/AggregateRoot';
import { ICommandHandler } from '../Shared/Infrastructure/CommandBus/ICommandHandler';
import { DomainEvent } from '@shared/Domain/Events/DomainEvent';

class TestCommand {
    constructor(public readonly data: string) {}
}

class TestEvent extends DomainEvent {
    constructor(public readonly eventData: string) {
        super('TestEvent');
    }
}

class TestAggregate extends AggregateRoot {
    private _data: string;

    constructor(data: string) {
        super();
        this._data = data;
        this.addDomainEvent(new TestEvent(data));
    }

    getData(): string {
        return this._data;
    }
}

class TestCommandHandler implements ICommandHandler<TestCommand> {
    async execute(command: TestCommand): Promise<TestAggregate> {
        return new TestAggregate(command.data);
    }
}

class FailingCommandHandler implements ICommandHandler<TestCommand> {
    async execute(command: TestCommand): Promise<TestAggregate> {
        throw new Error('Error simulado');
    }
}

describe('CommandBus', () => {
    let commandBus: CommandBus;
    let testHandler: jest.Mocked<ICommandHandler<TestCommand>>;

    beforeEach(() => {
        commandBus = new CommandBus();
        testHandler = {
            execute: jest.fn().mockResolvedValue(new TestAggregate('test data'))
        } as jest.Mocked<ICommandHandler<TestCommand>>;
    });

    describe('register', () => {
        it('debería registrar un handler correctamente', () => {
            // Act
            commandBus.register(TestCommand.name, testHandler);

            // Assert
            expect(testHandler.execute).not.toHaveBeenCalled();
        });

        it('debería mostrar una advertencia al sobrescribir un handler', () => {
            // Arrange
            const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
            commandBus.register(TestCommand.name, testHandler);

            // Act
            commandBus.register(TestCommand.name, testHandler);

            // Assert
            expect(consoleSpy).toHaveBeenCalledWith(
                `Advertencia: Sobrescribiendo handler para comando ${TestCommand.name}`
            );
            consoleSpy.mockRestore();
        });
    });

    describe('dispatch', () => {
        it('debería despachar un comando y ejecutar el handler', async () => {
            // Arrange
            const command = new TestCommand('test data');
            commandBus.register(TestCommand.name, testHandler);

            // Act
            const result = await commandBus.dispatch(command);

            // Assert
            expect(testHandler.execute).toHaveBeenCalledWith(command);
            expect(result).toBeInstanceOf(TestAggregate);
            const events = result.getUncommittedEvents();
            expect(events).toHaveLength(1);
            expect(events[0]).toBeInstanceOf(TestEvent);
            const testEvent = events[0] as TestEvent;
            expect(testEvent.eventData).toBe('test data');
        });

        it('debería lanzar un error si no hay handler registrado', async () => {
            // Arrange
            const command = new TestCommand('test data');

            // Act & Assert
            await expect(commandBus.dispatch(command)).rejects.toThrow(
                `No hay handler registrado para el comando ${TestCommand.name}`
            );
        });

        it('debería manejar errores del handler', async () => {
            // Arrange
            const command = new TestCommand('test data');
            const error = new Error('Error simulado');
            testHandler.execute.mockRejectedValueOnce(error);
            commandBus.register(TestCommand.name, testHandler);

            // Act & Assert
            await expect(commandBus.dispatch(command)).rejects.toThrow('Error simulado');
        });
    });
}); 