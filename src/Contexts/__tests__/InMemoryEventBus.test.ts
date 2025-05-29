import { InMemoryEventBus } from '../Shared/Infrastructure/EventBus/InMemoryEventBus';
import { DomainEvent } from '@shared/Domain/Events/DomainEvent';

class TestEvent extends DomainEvent {
    constructor(public readonly data: string) {
        super('TestEvent');
    }
}

describe('InMemoryEventBus', () => {
    let eventBus: InMemoryEventBus;
    let testHandler: jest.Mock;
    let anotherHandler: jest.Mock;

    beforeEach(() => {
        eventBus = new InMemoryEventBus();
        testHandler = jest.fn().mockResolvedValue(undefined);
        anotherHandler = jest.fn().mockResolvedValue(undefined);
    });

    describe('subscribe', () => {
        it('debería suscribir un handler correctamente', () => {
            // Arrange
            const eventName = 'TestEvent';

            // Act
            eventBus.subscribe(eventName, testHandler);

            // Assert
            expect(testHandler).not.toHaveBeenCalled();
        });

        it('debería permitir múltiples handlers para el mismo evento', () => {
            // Arrange
            const eventName = 'TestEvent';

            // Act
            eventBus.subscribe(eventName, testHandler);
            eventBus.subscribe(eventName, anotherHandler);

            // Assert
            expect(testHandler).not.toHaveBeenCalled();
            expect(anotherHandler).not.toHaveBeenCalled();
        });
    });

    describe('publish', () => {
        it('debería publicar un evento y ejecutar el handler', async () => {
            // Arrange
            const event = new TestEvent('test data');
            eventBus.subscribe('TestEvent', testHandler);

            // Act
            await eventBus.publish(event);

            // Assert
            expect(testHandler).toHaveBeenCalledWith(event);
        });

        it('debería ejecutar múltiples handlers para el mismo evento', async () => {
            // Arrange
            const event = new TestEvent('test data');
            eventBus.subscribe('TestEvent', testHandler);
            eventBus.subscribe('TestEvent', anotherHandler);

            // Act
            await eventBus.publish(event);

            // Assert
            expect(testHandler).toHaveBeenCalledWith(event);
            expect(anotherHandler).toHaveBeenCalledWith(event);
        });

        it('debería manejar eventos sin handlers', async () => {
            // Arrange
            const event = new TestEvent('test data');

            // Act & Assert
            await expect(eventBus.publish(event)).resolves.not.toThrow();
        });

        it('debería manejar errores en los handlers', async () => {
            // Arrange
            const event = new TestEvent('test data');
            const errorHandler = jest.fn().mockRejectedValue(new Error('Error simulado'));
            eventBus.subscribe('TestEvent', errorHandler);

            // Act & Assert
            await expect(eventBus.publish(event)).rejects.toThrow('Error simulado');
        });
    });

    describe('unsubscribe', () => {
        it('debería desuscribir un handler correctamente', async () => {
            // Arrange
            const event = new TestEvent('test data');
            eventBus.subscribe('TestEvent', testHandler);
            eventBus.subscribe('TestEvent', anotherHandler);

            // Act
            eventBus.unsubscribe('TestEvent', testHandler);
            await eventBus.publish(event);

            // Assert
            expect(testHandler).not.toHaveBeenCalled();
            expect(anotherHandler).toHaveBeenCalledWith(event);
        });

        it('debería manejar la desuscripción de un handler no registrado', () => {
            // Arrange
            const eventName = 'TestEvent';
            const nonRegisteredHandler = jest.fn();

            // Act & Assert
            expect(() => eventBus.unsubscribe(eventName, nonRegisteredHandler)).not.toThrow();
        });

        it('debería mantener otros handlers al desuscribir uno', async () => {
            // Arrange
            const event = new TestEvent('test data');
            const thirdHandler = jest.fn().mockResolvedValue(undefined);
            eventBus.subscribe('TestEvent', testHandler);
            eventBus.subscribe('TestEvent', anotherHandler);
            eventBus.subscribe('TestEvent', thirdHandler);

            // Act
            eventBus.unsubscribe('TestEvent', testHandler);
            await eventBus.publish(event);

            // Assert
            expect(testHandler).not.toHaveBeenCalled();
            expect(anotherHandler).toHaveBeenCalledWith(event);
            expect(thirdHandler).toHaveBeenCalledWith(event);
        });
    });
}); 