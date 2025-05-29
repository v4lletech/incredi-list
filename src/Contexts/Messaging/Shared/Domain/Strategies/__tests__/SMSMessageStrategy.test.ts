import { SMSMessageStrategy } from '../SMSMessageStrategy';

describe('SMSMessageStrategy', () => {
    let smsStrategy: SMSMessageStrategy;

    beforeEach(() => {
        smsStrategy = new SMSMessageStrategy();
    });

    it('debería enviar un mensaje SMS correctamente', async () => {
        // Arrange
        const userId = '123';
        const userName = 'Juan Pérez';
        const message = '¡Bienvenido a nuestra plataforma!';
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

        // Act
        await smsStrategy.sendMessage(userId, userName, message);

        // Assert
        expect(consoleSpy).toHaveBeenCalledWith(`Enviando SMS de bienvenida a ${userName} (ID: ${userId}): ${message}`);
        consoleSpy.mockRestore();
    });

    it('debería manejar errores al enviar mensajes SMS', async () => {
        // Arrange
        const userId = '123';
        const userName = 'Juan Pérez';
        const message = '¡Bienvenido a nuestra plataforma!';
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {
            throw new Error('Error al enviar SMS');
        });

        // Act & Assert
        await expect(smsStrategy.sendMessage(userId, userName, message)).rejects.toThrow('Error al enviar SMS');
        consoleSpy.mockRestore();
    });

    it('debería validar que el mensaje no esté vacío', async () => {
        // Arrange
        const userId = '123';
        const userName = 'Juan Pérez';
        const message = '';

        // Act & Assert
        await expect(smsStrategy.sendMessage(userId, userName, message)).rejects.toThrow('El mensaje no puede estar vacío');
    });
}); 