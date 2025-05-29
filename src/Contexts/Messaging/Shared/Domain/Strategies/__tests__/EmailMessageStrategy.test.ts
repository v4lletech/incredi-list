import { EmailMessageStrategy } from '../EmailMessageStrategy';

describe('EmailMessageStrategy', () => {
    let emailStrategy: EmailMessageStrategy;

    beforeEach(() => {
        emailStrategy = new EmailMessageStrategy();
    });

    it('debería enviar un mensaje de email correctamente', async () => {
        // Arrange
        const userId = '123';
        const userName = 'Juan Pérez';
        const message = '¡Bienvenido a nuestra plataforma!';
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

        // Act
        await emailStrategy.sendMessage(userId, userName, message);

        // Assert
        expect(consoleSpy).toHaveBeenCalledWith(`Enviando email de bienvenida a ${userName} (ID: ${userId}): ${message}`);
        consoleSpy.mockRestore();
    });

    it('debería manejar errores al enviar mensajes de email', async () => {
        // Arrange
        const userId = '123';
        const userName = 'Juan Pérez';
        const message = '¡Bienvenido a nuestra plataforma!';
        const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {
            throw new Error('Error al enviar Email');
        });

        // Act & Assert
        await expect(emailStrategy.sendMessage(userId, userName, message)).rejects.toThrow('Error al enviar Email');
        consoleSpy.mockRestore();
    });

    it('debería validar que el mensaje no esté vacío', async () => {
        // Arrange
        const userId = '123';
        const userName = 'Juan Pérez';
        const message = '';

        // Act & Assert
        await expect(emailStrategy.sendMessage(userId, userName, message)).rejects.toThrow('El mensaje no puede estar vacío');
    });
}); 