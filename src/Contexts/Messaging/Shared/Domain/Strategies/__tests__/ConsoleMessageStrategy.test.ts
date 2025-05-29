import { ConsoleMessageStrategy } from '../ConsoleMessageStrategy';

describe('ConsoleMessageStrategy', () => {
    let consoleStrategy: ConsoleMessageStrategy;
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
        consoleStrategy = new ConsoleMessageStrategy();
        consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    it('debería enviar un mensaje por consola correctamente', async () => {
        // Arrange
        const userId = '123';
        const userName = 'Juan Pérez';
        const message = '¡Bienvenido a nuestra plataforma!';

        // Act
        await consoleStrategy.sendMessage(userId, userName, message);

        // Assert
        expect(consoleSpy).toHaveBeenCalledWith(`Enviando mensaje de bienvenida por consola a ${userName} (ID: ${userId}): ${message}`);
    });

    it('debería manejar errores al enviar mensajes por consola', async () => {
        // Arrange
        const userId = '123';
        const userName = 'Juan Pérez';
        const message = '¡Bienvenido a nuestra plataforma!';
        consoleSpy.mockImplementation(() => {
            throw new Error('Error al enviar mensaje por consola');
        });

        // Act & Assert
        await expect(consoleStrategy.sendMessage(userId, userName, message)).rejects.toThrow('Error al enviar mensaje por consola');
    });

    it('debería validar que el mensaje no esté vacío', async () => {
        // Arrange
        const userId = '123';
        const userName = 'Juan Pérez';
        const message = '';

        // Act & Assert
        await expect(consoleStrategy.sendMessage(userId, userName, message)).rejects.toThrow('El mensaje no puede estar vacío');
        expect(consoleSpy).not.toHaveBeenCalled();
    });

    it('debería validar que el mensaje no contenga solo espacios en blanco', async () => {
        // Arrange
        const userId = '123';
        const userName = 'Juan Pérez';
        const message = '   ';

        // Act & Assert
        await expect(consoleStrategy.sendMessage(userId, userName, message)).rejects.toThrow('El mensaje no puede estar vacío');
        expect(consoleSpy).not.toHaveBeenCalled();
    });
}); 